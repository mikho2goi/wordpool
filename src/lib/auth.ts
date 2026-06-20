import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "admin_session";

// A fixed signed token derived from the secret. Presence of this exact value
// in the cookie proves the holder logged in with the admin password.
export function adminToken(): string {
  const secret = process.env.ADMIN_SECRET ?? "dev-insecure-secret";
  return crypto.createHmac("sha256", secret).update("admin-v1").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const val = store.get(ADMIN_COOKIE)?.value;
  if (!val) return false;
  const expected = adminToken();
  if (val.length !== expected.length) return false;
  // constant-time compare to avoid timing leaks
  return crypto.timingSafeEqual(Buffer.from(val), Buffer.from(expected));
}
