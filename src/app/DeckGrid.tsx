"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

type Deck = {
  id: number;
  name: string;
  cardCount: number;
  colors: string[];
};

export default function DeckGrid({
  decks,
  isAdmin,
}: {
  decks: Deck[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = q
    ? decks.filter((d) => d.name.toLowerCase().includes(q))
    : decks;

  async function renameDeck(deck: Deck) {
    const name = prompt("Rename deck:", deck.name)?.trim();
    if (!name || name === deck.name) return;
    const res = await fetch(`/api/decks/${deck.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Rename failed.");
      return;
    }
    router.refresh();
  }

  async function deleteDeck(deck: Deck) {
    if (
      !confirm(
        `Delete deck "${deck.name}" and all ${deck.cardCount} of its cards? This can't be undone.`
      )
    )
      return;
    setDeletingId(deck.id);
    const res = await fetch(`/api/decks/${deck.id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      alert("Delete failed (are you still logged in?).");
      return;
    }
    router.refresh();
  }

  if (decks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
        <p className="text-slate-500">
          {t("noDecks")}{" "}
          <Link href="/add" className="font-medium text-indigo-600 underline">
            {t("addFirst")}
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchDecks")}
        className="mb-5 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500">
          {t("noMatch")}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((deck) => (
        <li key={deck.id} className="relative">
          <Link
            href={`/deck/${deck.id}`}
            className="group block h-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="mb-4 flex gap-1.5">
              {deck.colors.length === 0 ? (
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              ) : (
                deck.colors.map((c, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-slate-200"
                    style={{ backgroundColor: c }}
                  />
                ))
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
              {deck.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {deck.cardCount} {deck.cardCount === 1 ? t("word") : t("words")}
            </p>
          </Link>

          {isAdmin && (
            <div className="absolute right-3 top-3 flex gap-1.5">
              <button
                onClick={() => renameDeck(deck)}
                aria-label={`Rename deck ${deck.name}`}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 opacity-80 transition hover:bg-slate-200 hover:opacity-100"
              >
                ✎
              </button>
              <button
                onClick={() => deleteDeck(deck)}
                disabled={deletingId === deck.id}
                aria-label={`Delete deck ${deck.name}`}
                className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 opacity-80 transition hover:bg-red-100 hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === deck.id ? "…" : "✕"}
              </button>
            </div>
          )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
