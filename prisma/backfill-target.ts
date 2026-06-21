// One-off: set Deck.targetLang = "vi-VN" for existing decks (all current
// meanings are Vietnamese). Idempotent — skips decks already set.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const res = await prisma.deck.updateMany({
    where: { targetLang: null },
    data: { targetLang: "vi-VN" },
  });
  console.log(`Set targetLang="vi-VN" on ${res.count} deck(s).`);
}

main().finally(() => prisma.$disconnect());
