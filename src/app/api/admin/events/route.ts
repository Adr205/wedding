import { NextResponse } from "next/server";
import { saveEventBundle } from "@/features/admin/data/events";
import { requireApiUser } from "@/lib/auth/requireUser";

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const payload = await request.json();
  const result = await saveEventBundle(user.id, payload);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ eventId: result.eventId }, { status: 201 });
}
