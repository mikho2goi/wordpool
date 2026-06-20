import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import StudyMode from "./StudyMode";
import { DeckHeader, EmptyDeck } from "./DeckHeader";

export const dynamic = "force-dynamic";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deckId = Number(id);
  if (!Number.isInteger(deckId)) notFound();

  const [deck, admin] = await Promise.all([
    prisma.deck.findUnique({
      where: { id: deckId },
      include: { cards: { orderBy: { createdAt: "desc" } } },
    }),
    isAdmin(),
  ]);

  if (!deck) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <DeckHeader deckName={deck.name} count={deck.cards.length} />
      {deck.cards.length === 0 ? (
        <EmptyDeck />
      ) : (
        <StudyMode cards={deck.cards} isAdmin={admin} />
      )}
    </main>
  );
}
