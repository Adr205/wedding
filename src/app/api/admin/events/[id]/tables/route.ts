import { NextResponse } from "next/server";
import { createTable } from "@/features/admin/data/tables";
import { requireApiUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireApiUser();
  if (!user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { id } = await context.params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Cuerpo inválido" }, { status: 400 });
  }

  const result = await createTable(id, user.id, body, superAdmin);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 400 });
  return NextResponse.json(result, { status: 201 });
}
