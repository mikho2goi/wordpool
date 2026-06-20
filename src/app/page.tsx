import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { getCurrentUser } from "@/lib/userAuth";
import AdminBar from "./AdminBar";
import UserBar from "./UserBar";
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
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            WordPool
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            A shared deck of flashcards. Anyone can add a word — everyone studies it.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <UserBar username={user?.username ?? null} />
          <AdminBar isAdmin={admin} />
          <Link
            href="/add"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + Add card
          </Link>
        </div>
      </header>

      {decks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <p className="text-slate-500">
            No decks yet.{" "}
            <Link href="/add" className="font-medium text-indigo-600 underline">
              Add the first card
            </Link>
            .
          </p>
        </div>
      ) : (
        <DeckGrid
          isAdmin={admin}
          decks={decks.map((deck) => ({
            id: deck.id,
            name: deck.name,
            cardCount: deck._count.cards,
            colors: deck.cards.map((c) => c.color),
          }))}
        />
      )}
    </main>
  );
}
