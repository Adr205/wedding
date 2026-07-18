import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/serviceClient";

const schema = z.object({
  slug: z.string().min(1),
  author_name: z.string().trim().min(2).max(80),
  body: z.string().trim().min(1).max(500),
  // Honeypot: bots fill hidden fields.
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Datos inválidos" }, { status: 422 });
  }

  const { slug, author_name, body, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // silently drop bots

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

  // Land unapproved — the couple moderates before it shows publicly.
  const { error } = await supabase.from("event_messages").insert({
    event_id: event.id,
    author_name,
    body,
    approved: false,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "No se pudo enviar tu mensaje" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
