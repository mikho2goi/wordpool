import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // always show freshest decks

export default async function Home() {
  const decks = await prisma.deck.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cards: true } } },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WordPool</h1>
          <p className="text-sm text-gray-500">
            A shared deck of flashcards. Anyone can add a word.
          </p>
        </div>
        <Link
          href="/add"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add card
        </Link>
      </header>

      {decks.length === 0 ? (
        <p className="text-gray-500">
          No decks yet.{" "}
          <Link href="/add" className="underline">
            Add the first card
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {decks.map((deck) => (
            <li key={deck.id}>
              <Link
                href={`/deck/${deck.id}`}
                className="block rounded-xl border border-gray-200 p-5 transition hover:border-gray-400 hover:shadow-sm"
              >
                <h2 className="text-lg font-semibold">{deck.name}</h2>
                <p className="text-sm text-gray-500">
                  {deck._count.cards}{" "}
                  {deck._count.cards === 1 ? "card" : "cards"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
