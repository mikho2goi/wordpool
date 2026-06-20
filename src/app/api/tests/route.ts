import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/userAuth";

// GET /api/tests — current user's saved tests
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const tests = await prisma.savedTest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // attach deck names + card counts
  const deckIds = [...new Set(tests.map((t) => t.deckId))];
  const decks = await prisma.deck.findMany({
    where: { id: { in: deckIds } },
    select: { id: true, name: true },
  });
  const deckName = new Map(decks.map((d) => [d.id, d.name]));

  return NextResponse.json(
    tests.map((t) => {
      let count = 0;
      try {
        count = (JSON.parse(t.cardIds) as number[]).length;
      } catch {}
      return {
        id: t.id,
        name: t.name,
        deckId: t.deckId,
        deckName: deckName.get(t.deckId) ?? "(deleted deck)",
        count,
        createdAt: t.createdAt,
      };
    })
  );
}

// POST /api/tests — save a test (a named set of card ids)
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    deckId?: unknown;
    cardIds?: unknown;
  };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const deckId = Number(body.deckId);
  const cardIds = Array.isArray(body.cardIds)
    ? body.cardIds.filter((x) => Number.isInteger(x)).map(Number)
    : [];

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!Number.isInteger(deckId) || cardIds.length === 0) {
    return NextResponse.json(
      { error: "Pick some words first." },
      { status: 400 }
    );
  }

  const test = await prisma.savedTest.create({
    data: { userId: user.id, name, deckId, cardIds: JSON.stringify(cardIds) },
  });

  return NextResponse.json({ id: test.id }, { status: 201 });
}
