import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// DELETE /api/decks/[id] — admin only. Cascade-deletes the deck's cards.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deckId = Number(id);
  if (!Number.isInteger(deckId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.deck.delete({ where: { id: deckId } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
