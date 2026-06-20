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
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← All decks
        </Link>
        <Link
          href="/add"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 active:scale-95"
        >
          + Add card
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {deck.name}
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-500">
        {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
      </p>

      {deck.cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <p className="text-slate-500">
            No cards in this deck yet.{" "}
            <Link href="/add" className="font-medium text-indigo-600 underline">
              Add one
            </Link>
            .
          </p>
        </div>
      ) : (
        <StudyMode cards={deck.cards} />
      )}
    </main>
  );
}
