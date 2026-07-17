import { NextResponse } from "next/server";
import { z } from "zod";
import { getGuestByToken } from "@/features/invitation/data/guestInvite";

type RouteContext = { params: Promise<{ slug: string }> };

const tokenSchema = z.string().uuid();

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  const parsed = tokenSchema.safeParse(token);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const guest = await getGuestByToken(slug, parsed.data);
  if (!guest) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json({ ok: true, guest });
}
