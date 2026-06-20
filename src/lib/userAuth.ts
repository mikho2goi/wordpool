import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const USER_COOKIE = "user_session";

function secret(): string {
  return process.env.ADMIN_SECRET ?? "dev-insecure-secret";
}

// session token = "<userId>.<hmac(userId)>" — tamper-proof without a DB session table
export function signSession(userId: number): string {
  const sig = crypto
    .createHmac("sha256", secret())
    .update(String(userId))
    .digest("hex");
  return `${userId}.${sig}`;
}

function verifySession(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const idPart = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret())
    .update(idPart)
    .digest("hex");
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  const id = Number(idPart);
  return Number.isInteger(id) ? id : null;
}

export async function getCurrentUser(): Promise<{
  id: number;
  username: string;
} | null> {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) return null;
  const id = verifySession(token);
  if (id === null) return null;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true },
  });
  return user ?? null;
}
