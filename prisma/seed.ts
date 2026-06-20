import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const spanish = await prisma.deck.upsert({
    where: { name: "Spanish" },
    update: {},
    create: { name: "Spanish" },
  });

  const gre = await prisma.deck.upsert({
    where: { name: "GRE Vocab" },
    update: {},
    create: { name: "GRE Vocab" },
  });

  await prisma.card.createMany({
    data: [
      {
        word: "casa",
        meaning: "house",
        explanation: "La casa es grande. = The house is big.",
        authorName: "seed",
        deckId: spanish.id,
      },
      {
        word: "perro",
        meaning: "dog",
        explanation: null,
        authorName: "seed",
        deckId: spanish.id,
      },
      {
        word: "ephemeral",
        meaning: "lasting a very short time",
        explanation: "Fame can be ephemeral.",
        authorName: "seed",
        deckId: gre.id,
      },
      {
        word: "ubiquitous",
        meaning: "present everywhere",
        explanation: "Smartphones are ubiquitous.",
        authorName: "seed",
        deckId: gre.id,
      },
    ],
  });

  console.log("Seeded decks + cards.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
