import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { getCurrentUser } from "@/lib/userAuth";
import HomeHeader from "./HomeHeader";
import DeckGrid from "./DeckGrid";

export const dynamic = "force-dynamic"; // always show freshest decks

export default async function Home() {
  const [decks, admin, user] = await Promise.all([
    prisma.deck.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { cards: true } },
        cards: { select: { color: true }, take: 4 },
      },
    }),
    isAdmin(),
    getCurrentUser(),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <HomeHeader isAdmin={admin} username={user?.username ?? null} />
      <DeckGrid
        isAdmin={admin}
        decks={decks.map((deck) => ({
          id: deck.id,
          name: deck.name,
          cardCount: deck._count.cards,
          colors: deck.cards.map((c) => c.color),
        }))}
      />
    </main>
  );
}
