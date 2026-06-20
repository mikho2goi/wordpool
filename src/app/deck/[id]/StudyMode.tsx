"use client";

import { useCallback, useEffect, useState } from "react";
import { readableText } from "@/lib/colors";

type Card = {
  id: number;
  word: string;
  meaning: string;
  explanation: string | null;
  authorName: string;
  color: string;
};

export default function StudyMode({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const card = cards[index];
  const fg = readableText(card.color);

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const prev = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // keyboard: space flips, arrows navigate
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

  return (
    <div className="flex flex-col items-center gap-6">
      {/* progress */}
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

      {/* the card */}
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

      <p className="text-xs text-slate-400">added by {card.authorName}</p>

      {/* controls */}
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
