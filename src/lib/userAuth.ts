import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signUserToken, verifyUserToken, USER_TOKEN_TTL_S } from "@/lib/jwt";

export const USER_COOKIE = "user_session";
export const USER_COOKIE_MAX_AGE = USER_TOKEN_TTL_S;

// session token is now a JWT (sub=userId, ver=tokenVersion, exp=7d)
export async function signSession(userId: number, ver: number): Promise<string> {
  return signUserToken(userId, ver);
}

export async function getCurrentUser(): Promise<{
  id: number;
  username: string;
} | null> {
  const store = await cookies();
  const token = store.get(USER_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifyUserToken(token);
  if (!claims) return null; // bad sig or expired

  const user = await prisma.user.findUnique({
    where: { id: claims.userId },
    select: { id: true, username: true, tokenVersion: true },
  });
  if (!user) return null;
  if (user.tokenVersion !== claims.ver) return null; // revoked (logged out everywhere)

  return { id: user.id, username: user.username };
}
