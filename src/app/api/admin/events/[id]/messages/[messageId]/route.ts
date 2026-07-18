import { NextResponse } from "next/server";
import { deleteMessage, setMessageApproved } from "@/features/admin/data/community";
import { requireApiUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type RouteContext = { params: Promise<{ id: string; messageId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { messageId } = await context.params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  let body: { approved?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido" }, { status: 400 });
  }
  if (typeof body.approved !== "boolean") {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 422 });
  }

  const result = await setMessageApproved(messageId, body.approved, superAdmin);
  if (!result.ok) return NextResponse.json({ message: "No se pudo actualizar" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { messageId } = await context.params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  const result = await deleteMessage(messageId, superAdmin);
  if (!result.ok) return NextResponse.json({ message: "No se pudo eliminar" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
