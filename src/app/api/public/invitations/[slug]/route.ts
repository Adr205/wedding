import { NextResponse } from "next/server";
import { getInvitationBySlug } from "@/features/invitation/data/getInvitationBySlug";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return NextResponse.json({ message: "Invitación no encontrada" }, { status: 404 });
  }

  return NextResponse.json(invitation);
}
