import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE, USER_COOKIE_MAX_AGE, signSession } from "@/lib/userAuth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    username?: unknown;
    passphrase?: unknown;
  };

  const username =
    typeof body.username === "string" ? body.username.trim() : "";
  const passphrase =
    typeof body.passphrase === "string" ? body.passphrase.trim() : "";

  if (!username || !passphrase) {
    return NextResponse.json(
      { error: "Nhập tên và cụm từ bí mật." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });

  // generic message either way — don't reveal whether the username exists
  const ok = user ? await bcrypt.compare(passphrase, user.passHash) : false;
  if (!user || !ok) {
    return NextResponse.json(
      { error: "Sai tên hoặc cụm từ bí mật." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ username: user.username });
  res.cookies.set(USER_COOKIE, await signSession(user.id, user.tokenVersion), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: USER_COOKIE_MAX_AGE,
  });
  return res;
}
