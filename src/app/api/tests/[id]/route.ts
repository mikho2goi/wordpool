import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/userAuth";

// DELETE /api/tests/[id] — delete one of your own saved tests
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const testId = Number(id);
  if (!Number.isInteger(testId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // deleteMany scoped to owner — silently no-ops if it isn't theirs
  await prisma.savedTest.deleteMany({ where: { id: testId, userId: user.id } });
  return NextResponse.json({ ok: true });
}
