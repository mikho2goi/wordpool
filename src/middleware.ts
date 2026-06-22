// Sliding session renewal: on page navigation, if a valid JWT has less than
// half its lifetime left, re-issue a fresh 7-day token. Runs on the edge —
// uses jose only (no Prisma). Actual revocation (tokenVersion) is enforced in
// getCurrentUser when the token is used.
import { NextResponse, type NextRequest } from "next/server";
import {
  verifyUserToken,
  signUserToken,
  USER_TOKEN_TTL_S,
} from "@/lib/jwt";

const COOKIE = "user_session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return NextResponse.next();

  const claims = await verifyUserToken(token);
  if (!claims) return NextResponse.next();

  const now = Math.floor(Date.now() / 1000);
  const remaining = claims.exp - now;
  if (remaining > USER_TOKEN_TTL_S / 2) return NextResponse.next(); // still fresh

  const fresh = await signUserToken(claims.userId, claims.ver);
  const res = NextResponse.next();
  res.cookies.set(COOKIE, fresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: USER_TOKEN_TTL_S,
  });
  return res;
}

// Skip static assets and API routes (routes manage their own cookies).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
