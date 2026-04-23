import QRCode from "qrcode";
import { requireApiUser } from "@/lib/auth/requireUser";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (!user) return new Response("No autorizado", { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("slug")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!event) return new Response("Evento no encontrado", { status: 404 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(request.url).origin;
  const invitationUrl = `${baseUrl}/i/${event.slug}`;

  const svg = await QRCode.toString(invitationUrl, {
    type: "svg",
    margin: 2,
    width: 512,
    color: { dark: "#1c1917", light: "#ffffff" },
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="qr-${event.slug}.svg"`,
      "Cache-Control": "no-store",
    },
  });
}
