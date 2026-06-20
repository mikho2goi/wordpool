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

// PATCH /api/decks/[id] — admin only. Rename the deck.
export async function PATCH(
  req: Request,
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

  const body = (await req.json().catch(() => ({}))) as { name?: unknown };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  // name is unique — reject if another deck already uses it
  const clash = await prisma.deck.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, id: { not: deckId } },
  });
  if (clash) {
    return NextResponse.json(
      { error: `A deck named "${clash.name}" already exists.` },
      { status: 409 }
    );
  }

  const deck = await prisma.deck
    .update({ where: { id: deckId }, data: { name } })
    .catch(() => null);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }
  return NextResponse.json(deck);
}
