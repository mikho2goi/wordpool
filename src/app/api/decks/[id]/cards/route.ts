import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/decks/[id]/cards — deck info + its cards
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deckId = Number(id);

  if (!Number.isInteger(deckId)) {
    return NextResponse.json({ error: "Invalid deck id" }, { status: 400 });
  }

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: { orderBy: { createdAt: "desc" } } },
  });

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  return NextResponse.json(deck);
}
