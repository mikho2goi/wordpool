import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StudyMode from "./StudyMode";

export const dynamic = "force-dynamic";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deckId = Number(id);
  if (!Number.isInteger(deckId)) notFound();

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: { orderBy: { createdAt: "desc" } } },
  });

  if (!deck) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← All decks
      </Link>
      <h1 className="mt-3 mb-1 text-3xl font-bold tracking-tight">
        {deck.name}
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
      </p>

      {deck.cards.length === 0 ? (
        <p className="text-gray-500">
          No cards in this deck yet.{" "}
          <Link href="/add" className="underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <StudyMode cards={deck.cards} />
      )}
    </main>
  );
}
