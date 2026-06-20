import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LANG, isValidLang } from "@/lib/langs";

// POST /api/cards — add a card; creates the deck if it doesn't exist yet
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { deckName, word, meaning, explanation, ipa, authorName, color, lang } =
    (body ?? {}) as Record<string, unknown>;

  // basic validation — required fields + length limits (cheap spam guard)
  const required = { deckName, word, meaning, authorName };
  for (const [key, val] of Object.entries(required)) {
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

  // color: accept only a #rrggbb hex; otherwise fall back to white
  const colorClean =
    typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color)
      ? color
      : "#ffffff";

  const langClean = isValidLang(lang) ? lang : DEFAULT_LANG;

  const deckNameClean = (deckName as string).trim();
  const wordClean = (word as string).trim();

  // find-or-create the deck, then create the card pointing at it
  const deck = await prisma.deck.upsert({
    where: { name: deckNameClean },
    update: {},
    create: { name: deckNameClean },
  });

  // no duplicate words within the same deck (case-insensitive)
  const dup = await prisma.card.findFirst({
    where: { deckId: deck.id, word: { equals: wordClean, mode: "insensitive" } },
  });
  if (dup) {
    return NextResponse.json(
      { error: `"${dup.word}" is already in ${deck.name}.` },
      { status: 409 }
    );
  }

  const card = await prisma.card.create({
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
      authorName: (authorName as string).trim(),
      color: colorClean,
      lang: langClean,
      deckId: deck.id,
    },
  });

  return NextResponse.json(card, { status: 201 });
}
