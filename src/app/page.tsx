import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import AdminBar from "./AdminBar";

export const dynamic = "force-dynamic"; // always show freshest decks

export default async function Home() {
  const [decks, admin] = await Promise.all([
    prisma.deck.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { cards: true } },
        cards: { select: { color: true }, take: 4 },
      },
    }),
    isAdmin(),
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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <li key={deck.id}>
              <Link
                href={`/deck/${deck.id}`}
                className="group block h-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="mb-4 flex gap-1.5">
                  {deck.cards.length === 0 ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  ) : (
                    deck.cards.map((c, i) => (
                      <span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-200"
                        style={{ backgroundColor: c.color }}
                      />
                    ))
                  )}
                </div>
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                  {deck.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
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
