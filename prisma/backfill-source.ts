// One-off: set Deck.sourceLang from the deck's existing cards (the word's
// `lang`). Idempotent — skips decks already set or with no cards.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const decks = await prisma.deck.findMany({
    include: { cards: { select: { lang: true }, take: 1 } },
  });
  let updated = 0;
  for (const d of decks) {
    if (d.sourceLang) continue;
    const lang = d.cards[0]?.lang;
    if (!lang) continue;
    await prisma.deck.update({ where: { id: d.id }, data: { sourceLang: lang } });
    console.log(`${d.name} -> ${lang}`);
    updated++;
  }
  console.log(`Done. Updated ${updated} deck(s).`);
}

main().finally(() => prisma.$disconnect());
