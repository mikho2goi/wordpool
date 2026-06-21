import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { MAX_DECK_NAME, isValidLevel } from "@/lib/deckMeta";
import { isValidLang } from "@/lib/langs";

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

  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    level?: unknown;
    sourceLang?: unknown;
    targetLang?: unknown;
  };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (name.length > MAX_DECK_NAME) {
    return NextResponse.json(
      { error: `Name too long (max ${MAX_DECK_NAME} characters).` },
      { status: 400 }
    );
  }

  // level: optional. null/empty clears it; otherwise must be a valid level.
  let level: string | null | undefined;
  if ("level" in body) {
    if (body.level === null || body.level === "") level = null;
    else if (isValidLevel(body.level)) level = body.level;
    else
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  // sourceLang: optional. null/empty clears it; otherwise a valid lang code.
  let sourceLang: string | null | undefined;
  if ("sourceLang" in body) {
    if (body.sourceLang === null || body.sourceLang === "") sourceLang = null;
    else if (isValidLang(body.sourceLang)) sourceLang = body.sourceLang;
    else
      return NextResponse.json(
        { error: "Invalid source language" },
        { status: 400 }
      );
  }

  // targetLang: optional. null/empty clears it; otherwise a valid lang code.
  let targetLang: string | null | undefined;
  if ("targetLang" in body) {
    if (body.targetLang === null || body.targetLang === "") targetLang = null;
    else if (isValidLang(body.targetLang)) targetLang = body.targetLang;
    else
      return NextResponse.json(
        { error: "Invalid target language" },
        { status: 400 }
      );
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
    .update({
      where: { id: deckId },
      data: {
        name,
        ...(level !== undefined && { level }),
        ...(sourceLang !== undefined && { sourceLang }),
        ...(targetLang !== undefined && { targetLang }),
      },
    })
    .catch(() => null);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }
  return NextResponse.json(deck);
}
