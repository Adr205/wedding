import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveEventBundle } from "@/features/admin/data/events";
import { requireApiUser } from "@/lib/auth/requireUser";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("id, slug, title, event_type, is_published")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = await request.json();
  const result = await saveEventBundle(user.id, payload, id);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ eventId: result.eventId });
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id).eq("owner_id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
