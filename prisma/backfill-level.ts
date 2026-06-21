// One-off: set Deck.level for existing decks from their name convention
// (English_Basic_Food -> "Basic"). Idempotent — safe to re-run.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { parseDeckName } from "../src/lib/deckMeta";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const decks = await prisma.deck.findMany();
  let updated = 0;
  for (const d of decks) {
    if (d.level) continue; // already set
    const { level } = parseDeckName(d.name);
    if (!level) continue;
    await prisma.deck.update({ where: { id: d.id }, data: { level } });
    console.log(`${d.name} -> ${level}`);
    updated++;
  }
  console.log(`Done. Updated ${updated} deck(s).`);
}

main().finally(() => prisma.$disconnect());
