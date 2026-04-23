import { requireApiUser } from "@/lib/auth/requireUser";
import { createClient } from "@/lib/supabase/server";

function escapeCsv(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (!user) return new Response("No autorizado", { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("slug, title")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!event) return new Response("Evento no encontrado", { status: 404 });

  const { data: guests } = await supabase
    .from("event_guests")
    .select("guest_name, guest_phone, plus_ones, confirmation_status, created_at")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  const rows = guests ?? [];

  const headers = ["Nombre", "Teléfono", "Acompañantes", "Total asistentes", "Estado", "Fecha confirmación"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        escapeCsv(r.guest_name),
        escapeCsv(r.guest_phone),
        escapeCsv(r.plus_ones),
        escapeCsv(1 + (r.plus_ones ?? 0)),
        escapeCsv(r.confirmation_status),
        escapeCsv(new Date(r.created_at).toLocaleString("es-MX")),
      ].join(",")
    ),
  ];

  const csv = lines.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvp-${event.slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
