// JWT helpers (HS256) via jose — works in both Node routes and edge middleware.
// Signing key reuses ADMIN_SECRET (already set in Vercel env).
import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";
export const USER_TOKEN_TTL_S = 60 * 60 * 24 * 7; // 7 days

function key(): Uint8Array {
  return new TextEncoder().encode(
    process.env.ADMIN_SECRET ?? "dev-insecure-secret"
  );
}

// payload: sub = userId, ver = User.tokenVersion (for revocation)
export async function signUserToken(
  userId: number,
  ver: number
): Promise<string> {
  return new SignJWT({ ver })
    .setProtectedHeader({ alg: ALG })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${USER_TOKEN_TTL_S}s`)
    .sign(key());
}

export type UserClaims = { userId: number; ver: number; exp: number };

// Returns null for bad signature, expired, or malformed tokens.
export async function verifyUserToken(
  token: string
): Promise<UserClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: [ALG] });
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) return null;
    const ver = typeof payload.ver === "number" ? payload.ver : 0;
    return { userId, ver, exp: payload.exp ?? 0 };
  } catch {
    return null;
  }
}
