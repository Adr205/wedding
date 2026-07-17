import { NextResponse } from "next/server";
import { deleteGuest, updateGuest } from "@/features/admin/data/guests";
import { requireApiUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type RouteContext = { params: Promise<{ id: string; guestId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { guestId } = await context.params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido" }, { status: 400 });
  }

  const result = await updateGuest(guestId, user.id, body, superAdmin);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 400 });
  return NextResponse.json(result);
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { guestId } = await context.params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  const result = await deleteGuest(guestId, user.id, superAdmin);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
