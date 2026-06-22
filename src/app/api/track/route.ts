// Increment today's page-view counter. Called fire-and-forget from the client
// on each page load, so only real (JS-running) visits are counted.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/day";

export async function POST() {
  const day = todayKey();
  await prisma.dailyView.upsert({
    where: { day },
    create: { day, count: 1 },
    update: { count: { increment: 1 } },
  });
  return NextResponse.json({ ok: true });
}
