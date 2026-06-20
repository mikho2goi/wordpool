import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE, signSession } from "@/lib/userAuth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    username?: unknown;
    passphrase?: unknown;
  };

  const username =
    typeof body.username === "string" ? body.username.trim() : "";
  const passphrase =
    typeof body.passphrase === "string" ? body.passphrase.trim() : "";

  if (username.length < 2 || username.length > 40) {
    return NextResponse.json(
      { error: "Tên phải từ 2–40 ký tự." },
      { status: 400 }
    );
  }
  // passphrase: encourage a memorable multi-word phrase, not a short password
  if (passphrase.length < 8) {
    return NextResponse.json(
      { error: "Cụm từ quá ngắn — hãy dùng một câu dễ nhớ (ít nhất 8 ký tự)." },
      { status: 400 }
    );
  }
  if (passphrase.length > 200) {
    return NextResponse.json(
      { error: "Cụm từ quá dài." },
      { status: 400 }
    );
  }

  const taken = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  if (taken) {
    return NextResponse.json(
      { error: "Tên này đã được dùng." },
      { status: 409 }
    );
  }

  const passHash = await bcrypt.hash(passphrase, 10);
  const user = await prisma.user.create({
    data: { username, passHash },
    select: { id: true, username: true },
  });

  const res = NextResponse.json({ username: user.username }, { status: 201 });
  res.cookies.set(USER_COOKIE, signSession(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
