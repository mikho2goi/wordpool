"use client";

import { useState } from "react";

type Card = {
  id: number;
  word: string;
  meaning: string;
  explanation: string | null;
  authorName: string;
};

export default function StudyMode({ cards }: { cards: Card[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const card = cards[index];

  function next() {
    setRevealed(false);
    setIndex((i) => (i + 1) % cards.length);
  }

  function prev() {
    setRevealed(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">
        Card {index + 1} of {cards.length}
      </p>

      <button
        onClick={() => setRevealed((r) => !r)}
        className="flex min-h-56 w-full max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md"
      >
        {!revealed ? (
          <span className="text-3xl font-semibold">{card.word}</span>
        ) : (
          <div className="space-y-3">
            <p className="text-2xl font-medium">{card.meaning}</p>
            {card.explanation && (
              <p className="text-sm text-gray-500">{card.explanation}</p>
            )}
          </div>
        )}
        <span className="mt-6 text-xs text-gray-400">
          {revealed ? "Tap to hide" : "Tap to reveal"}
        </span>
      </button>

      <p className="text-xs text-gray-400">added by {card.authorName}</p>

      <div className="flex gap-3">
        <button
          onClick={prev}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          ← Prev
        </button>
        <button
          onClick={next}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
