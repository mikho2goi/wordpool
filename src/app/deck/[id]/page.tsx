import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { getCurrentUser } from "@/lib/userAuth";
import StudyMode from "./StudyMode";
import { DeckHeader, EmptyDeck } from "./DeckHeader";

export const dynamic = "force-dynamic";

export default async function DeckPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ test?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const deckId = Number(id);
  if (!Number.isInteger(deckId)) notFound();

  const [deck, admin, user] = await Promise.all([
    prisma.deck.findUnique({
      where: { id: deckId },
      include: { cards: { orderBy: { createdAt: "desc" } } },
    }),
    isAdmin(),
    getCurrentUser(),
  ]);

  if (!deck) notFound();

  // opened from a saved test? load that user's picked card ids
  let initialSelected: number[] | undefined;
  let autoTest = false;
  const testId = Number(sp?.test);
  if (user && Number.isInteger(testId)) {
    const saved = await prisma.savedTest.findFirst({
      where: { id: testId, userId: user.id, deckId },
    });
    if (saved) {
      try {
        initialSelected = JSON.parse(saved.cardIds) as number[];
        autoTest = true;
      } catch {}
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <DeckHeader deckName={deck.name} count={deck.cards.length} />
      {deck.cards.length === 0 ? (
        <EmptyDeck />
      ) : (
        <StudyMode
          cards={deck.cards}
          isAdmin={admin}
          deckId={deckId}
          isLoggedIn={!!user}
          initialSelected={initialSelected}
          autoTest={autoTest}
        />
      )}
    </main>
  );
}
