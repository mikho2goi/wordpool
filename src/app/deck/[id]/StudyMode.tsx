"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readableText } from "@/lib/colors";
import { speakText } from "@/lib/speak";

type Card = {
  id: number;
  word: string;
  meaning: string;
  explanation: string | null;
  authorName: string;
  color: string;
  lang: string;
};

export default function StudyMode({
  cards: initialCards,
  isAdmin,
}: {
  cards: Card[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const prev = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (cards.length === 0) {
    return (
      <p className="text-center text-slate-500">
        All cards removed from this deck.
      </p>
    );
  }

  const card = cards[index];
  const fg = readableText(card.color);

  async function handleDelete() {
    if (!confirm(`Delete "${card.word}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/cards/${card.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      alert("Delete failed (are you still logged in?).");
      return;
    }
    const remaining = cards.filter((c) => c.id !== card.id);
    setCards(remaining);
    setRevealed(false);
    setIndex((i) => (remaining.length === 0 ? 0 : i % remaining.length));
    router.refresh(); // keep deck counts fresh
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-slate-400">
          {index + 1} / {cards.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <button
        key={card.id + (revealed ? "-b" : "-f")}
        onClick={() => setRevealed((r) => !r)}
        style={{ backgroundColor: card.color, color: fg }}
        className="animate-pop flex min-h-64 w-full max-w-md flex-col items-center justify-center rounded-3xl border border-black/5 p-8 text-center shadow-lg transition active:scale-[0.99] sm:min-h-72"
      >
        {!revealed ? (
          <span className="text-3xl font-bold break-words sm:text-4xl">
            {card.word}
          </span>
        ) : (
          <div className="space-y-3">
            <p className="text-2xl font-semibold break-words sm:text-3xl">
              {card.meaning}
            </p>
            {card.explanation && (
              <p className="text-sm opacity-75">{card.explanation}</p>
            )}
          </div>
        )}
        <span className="mt-6 text-xs uppercase tracking-wide opacity-50">
          {revealed ? "tap to hide" : "tap to reveal"}
        </span>
      </button>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <button
          onClick={() =>
            speakText(revealed ? card.meaning : card.word, card.lang)
          }
          aria-label="Speak"
          className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          🔊 speak
        </button>
        <span>added by {card.authorName}</span>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "deleting…" : "Delete"}
          </button>
        )}
      </div>

      <div className="flex w-full max-w-md gap-3">
        <button
          onClick={prev}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
        >
          ← Prev
        </button>
        <button
          onClick={next}
          className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
        >
          Next →
        </button>
      </div>

      <p className="hidden text-center text-xs text-slate-400 sm:block">
        Tip: <kbd className="rounded bg-slate-200 px-1">space</kbd> to flip,{" "}
        <kbd className="rounded bg-slate-200 px-1">←</kbd>{" "}
        <kbd className="rounded bg-slate-200 px-1">→</kbd> to navigate
      </p>
    </div>
  );
}
