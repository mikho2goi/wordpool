import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { isValidLang } from "@/lib/langs";

// PATCH /api/cards/[id] — edit a card (admin only)
export async function PATCH(
  req: Request,
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { word, meaning, explanation, ipa, color, lang } = (body ??
    {}) as Record<string, unknown>;

  // word + meaning are required; same 500-char cap as the add route
  for (const [key, val] of Object.entries({ word, meaning })) {
    if (typeof val !== "string" || val.trim().length === 0) {
      return NextResponse.json(
        { error: `Missing or empty field: ${key}` },
        { status: 400 }
      );
    }
    if ((val as string).length > 500) {
      return NextResponse.json(
        { error: `Field too long: ${key}` },
        { status: 400 }
      );
    }
  }

  const existing = await prisma.card.findUnique({ where: { id: cardId } });
  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const wordClean = (word as string).trim();

  // keep the no-duplicate-word rule, ignoring this card itself
  const dup = await prisma.card.findFirst({
    where: {
      deckId: existing.deckId,
      id: { not: cardId },
      word: { equals: wordClean, mode: "insensitive" },
    },
  });
  if (dup) {
    return NextResponse.json(
      { error: `"${dup.word}" is already in this deck.` },
      { status: 409 }
    );
  }

  // color/lang: keep the old value if the new one is missing/invalid
  const colorClean =
    typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color)
      ? color
      : existing.color;
  const langClean = isValidLang(lang) ? lang : existing.lang;

  const updated = await prisma.card.update({
    where: { id: cardId },
    data: {
      word: wordClean,
      meaning: (meaning as string).trim(),
      explanation:
        typeof explanation === "string" && explanation.trim().length > 0
          ? explanation.trim()
          : null,
      ipa:
        typeof ipa === "string" && ipa.trim().length > 0
          ? ipa.trim().slice(0, 100)
          : null,
      color: colorClean,
      lang: langClean,
    },
  });

  return NextResponse.json(updated);
}

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
