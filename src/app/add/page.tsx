"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CARD_COLORS, DEFAULT_CARD_COLOR, readableText } from "@/lib/colors";
import { LANGUAGES, DEFAULT_LANG } from "@/lib/langs";
import { speakText } from "@/lib/speak";
import { useLang } from "@/lib/i18n";
import TopNav from "@/app/TopNav";

type Deck = { id: number; name: string; cardCount: number };

export default function AddPage() {
  const router = useRouter();
  const { t } = useLang();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckChoice, setDeckChoice] = useState(""); // existing deck name, or "__new__"
  const [newDeck, setNewDeck] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [explanation, setExplanation] = useState("");
  const [color, setColor] = useState<string>(DEFAULT_CARD_COLOR);
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [deckWords, setDeckWords] = useState<string[]>([]); // existing words in chosen deck

  useEffect(() => {
    fetch("/api/decks")
      .then((r) => r.json())
      .then(setDecks)
      .catch(() => {});
  }, []);

  // load existing words for the chosen deck (to suggest + block duplicates)
  useEffect(() => {
    if (!deckChoice || deckChoice === "__new__") {
      setDeckWords([]);
      return;
    }
    const deck = decks.find((d) => d.name === deckChoice);
    if (!deck) return;
    fetch(`/api/decks/${deck.id}/cards`)
      .then((r) => r.json())
      .then((d) =>
        setDeckWords(
          Array.isArray(d?.cards)
            ? d.cards.map((c: { word: string }) => c.word)
            : []
        )
      )
      .catch(() => setDeckWords([]));
  }, [deckChoice, decks]);

  const wordTrim = word.trim().toLowerCase();
  const isDuplicate =
    wordTrim.length > 0 &&
    deckWords.some((w) => w.toLowerCase() === wordTrim);
  const suggestions =
    wordTrim.length > 0
      ? deckWords
          .filter(
            (w) =>
              w.toLowerCase().includes(wordTrim) &&
              w.toLowerCase() !== wordTrim
          )
          .slice(0, 6)
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const deckName = deckChoice === "__new__" ? newDeck.trim() : deckChoice;
    if (!deckName) return setError("Pick or name a deck.");
    if (!authorName.trim()) return setError("Enter your name.");
    if (!word.trim() || !meaning.trim())
      return setError("Word and meaning are required.");
    if (isDuplicate)
      return setError(`"${word.trim()}" is already in this deck.`);

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
        color,
        lang,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return setError(data.error ?? "Something went wrong.");
    }

    setDone(true);
    setWord("");
    setMeaning("");
    setExplanation("");
    router.refresh();
  }

  const fg = readableText(color);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          {t("allDecks")}
        </Link>
        <TopNav />
      </div>
      <h1 className="mt-3 mb-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {t("addFlashcard")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="order-2 space-y-5 lg:order-1"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {t("deck")}
            </label>
            <select
              value={deckChoice}
              onChange={(e) => setDeckChoice(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">{t("chooseDeck")}</option>
              {decks.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.cardCount})
                </option>
              ))}
              <option value="__new__">{t("newDeckOption")}</option>
            </select>
            {deckChoice === "__new__" && (
              <input
                value={newDeck}
                onChange={(e) => setNewDeck(e.target.value)}
                placeholder={t("newDeckName")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            )}
          </div>

          <Field
            label={t("yourName")}
            value={authorName}
            onChange={setAuthorName}
          />

          {/* word with existing-word suggestions + duplicate guard */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {t("wordLabel")}
            </label>
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 ${
                isDuplicate
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            {isDuplicate && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {t("alreadyDeckWarn")}
              </p>
            )}
            {!isDuplicate && suggestions.length > 0 && (
              <div className="mt-1.5">
                <p className="mb-1 text-xs text-slate-400">{t("alreadyHere")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setWord(s)}
                      className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Field label={t("meaning")} value={meaning} onChange={setMeaning} />

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {t("explanation")}{" "}
              <span className="font-normal text-slate-400">{t("optional")}</span>
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* color picker */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {t("cardColor")}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CARD_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  style={{ backgroundColor: c }}
                  className={`h-9 w-9 rounded-full ring-1 ring-slate-300 transition hover:scale-110 ${
                    color === c
                      ? "ring-2 ring-indigo-500 ring-offset-2"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* voice / language */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {t("voice")}
            </label>
            <div className="flex gap-2">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => speakText(word.trim() || "Hello", lang)}
                className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
              >
                {t("testVoice")}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">{t("voiceHint")}</p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {done && !error && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {t("addedMsg")}{" "}
              <Link href="/" className="font-medium underline">
                {t("goToDecks")}
              </Link>
              .
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || isDuplicate}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
          >
            {submitting
              ? t("adding")
              : isDuplicate
                ? t("dupBtn")
                : t("addBtn")}
          </button>
        </form>

        {/* live preview */}
        <div className="order-1 lg:order-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            {t("livePreview")}
          </p>
          <div
            style={{ backgroundColor: color, color: fg }}
            className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-black/5 p-6 text-center shadow-lg transition lg:sticky lg:top-6"
          >
            <span className="text-2xl font-bold break-words sm:text-3xl">
              {word || "word"}
            </span>
            <span className="mt-2 text-sm opacity-75 break-words">
              {meaning || "meaning"}
            </span>
            {explanation && (
              <span className="mt-2 text-xs opacity-60">{explanation}</span>
            )}
            <span className="mt-5 text-[10px] uppercase tracking-wide opacity-50">
              {authorName ? `by ${authorName}` : "by you"}
            </span>
          </div>
        </div>
      </div>
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
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}
