import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/serviceClient";

const rsvpSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(2).max(100),
  phone: z.string().max(20).optional().nullable(),
  plus_ones: z.number().int().min(0).max(20).default(0),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Datos inválidos", issues: parsed.error.flatten() }, { status: 422 });
  }

  const { slug, name, phone, plus_ones } = parsed.data;
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
    confirmation_status: "confirmed",
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "No se pudo guardar tu confirmación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
