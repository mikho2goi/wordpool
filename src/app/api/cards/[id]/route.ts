import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// DELETE /api/cards/[id] — admin only
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.card.delete({ where: { id: cardId } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
