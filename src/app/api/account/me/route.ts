import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
