"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Deck = { id: number; name: string; cardCount: number };

export default function AddPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckChoice, setDeckChoice] = useState(""); // existing deck name, or "__new__"
  const [newDeck, setNewDeck] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/decks")
      .then((r) => r.json())
      .then(setDecks)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const deckName = deckChoice === "__new__" ? newDeck.trim() : deckChoice;
    if (!deckName) return setError("Pick or name a deck.");
    if (!authorName.trim()) return setError("Enter your name.");
    if (!word.trim() || !meaning.trim())
      return setError("Word and meaning are required.");

    setSubmitting(true);
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deckName,
        word,
        meaning,
        explanation,
        authorName,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return setError(data.error ?? "Something went wrong.");
    }

    setDone(true);
    // keep name + deck, clear the word fields for fast repeat entry
    setWord("");
    setMeaning("");
    setExplanation("");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← All decks
      </Link>
      <h1 className="mt-3 mb-8 text-3xl font-bold tracking-tight">
        Add a flashcard
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Deck</label>
          <select
            value={deckChoice}
            onChange={(e) => setDeckChoice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">— choose a deck —</option>
            {decks.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.cardCount})
              </option>
            ))}
            <option value="__new__">+ New deck…</option>
          </select>
          {deckChoice === "__new__" && (
            <input
              value={newDeck}
              onChange={(e) => setNewDeck(e.target.value)}
              placeholder="New deck name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          )}
        </div>

        <Field label="Your name" value={authorName} onChange={setAuthorName} />
        <Field label="Word" value={word} onChange={setWord} />
        <Field label="Meaning" value={meaning} onChange={setMeaning} />
        <div>
          <label className="mb-1 block text-sm font-medium">
            Explanation / example{" "}
            <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {done && !error && (
          <p className="text-sm text-green-600">
            Added! Add another, or{" "}
            <Link href="/" className="underline">
              go to decks
            </Link>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add card"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
