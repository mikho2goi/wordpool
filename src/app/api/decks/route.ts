import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/decks — all decks with card counts
export async function GET() {
  const decks = await prisma.deck.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cards: true } } },
  });

  return NextResponse.json(
    decks.map((d) => ({
      id: d.id,
      name: d.name,
      level: d.level,
      sourceLang: d.sourceLang,
      targetLang: d.targetLang,
      cardCount: d._count.cards,
    }))
  );
}
