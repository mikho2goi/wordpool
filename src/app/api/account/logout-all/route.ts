// "Log out everywhere": bump this user's tokenVersion so every existing JWT
// (which carries the old ver) is rejected on next use, then clear this device.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE, getCurrentUser } from "@/lib/userAuth";

export async function POST() {
  const user = await getCurrentUser();
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenVersion: { increment: 1 } },
    });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(USER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
