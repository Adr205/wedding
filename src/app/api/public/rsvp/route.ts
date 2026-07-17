import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { publicRsvpSchema } from "@/lib/validation/guestSchemas";
import { respondWithToken } from "@/features/invitation/data/guestInvite";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = publicRsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { slug, token, name, phone, plus_ones, attending, website } = parsed.data;

  // Honeypot: bots fill hidden fields. Pretend success without writing anything.
  if (website) return NextResponse.json({ ok: true });

  // ── Personalized invite: update the pre-loaded guest row ──────────────────
  if (token) {
    const ok = await respondWithToken({
      slug,
      token,
      name,
      phone: phone ?? null,
      plus_ones,
      attending,
    });
    if (!ok) {
      return NextResponse.json({ ok: false, message: "Invitación no válida" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  // ── Open RSVP: insert a new guest row ─────────────────────────────────────
  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!event) {
    return NextResponse.json({ ok: false, message: "Evento no encontrado" }, { status: 404 });
  }

  const { error } = await supabase.from("event_guests").insert({
    event_id: event.id,
    guest_name: name,
    guest_phone: phone ?? null,
    plus_ones,
    confirmation_status: attending ? "confirmed" : "declined",
    responded_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "No se pudo guardar tu confirmación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
