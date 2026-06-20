"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readableText } from "@/lib/colors";
import { speakText } from "@/lib/speak";
import { useLang } from "@/lib/i18n";

type Card = {
  id: number;
  word: string;
  meaning: string;
  explanation: string | null;
  authorName: string;
  color: string;
  lang: string;
};

type Result = { card: Card; your: string; ok: boolean };

// lenient compare: case/space/punctuation-insensitive
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:'"()]/g, "");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyMode({
  cards: initialCards,
  isAdmin,
}: {
  cards: Card[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { t } = useLang();

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // user-chosen subset to focus on
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedOnly, setSelectedOnly] = useState(false);

  // test/quiz mode
  const [testing, setTesting] = useState(false);
  const [quiz, setQuiz] = useState<Card[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const studyCards =
    selectedOnly && selectedIds.size > 0
      ? cards.filter((c) => selectedIds.has(c.id))
      : cards;

  const total = studyCards.length;
  const ci = total > 0 ? ((index % total) + total) % total : 0;

  // the test targets the picked words if any are picked, else the whole study set
  const testSet =
    selectedIds.size > 0
      ? cards.filter((c) => selectedIds.has(c.id))
      : studyCards;

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setRevealed(false);
    setIndex((i) => i - 1);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (testing) return; // arrows/space disabled during a test
      if (e.key === " ") {
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, testing]);

  function toggleSelect(id: number) {
    setSelectedIds((prevSet) => {
      const s = new Set(prevSet);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }

  function jumpTo(id: number) {
    const j = studyCards.findIndex((c) => c.id === id);
    if (j >= 0) {
      setRevealed(false);
      setIndex(j);
    }
  }

  function startTest() {
    setQuiz(shuffle(testSet));
    setQIndex(0);
    setAnswer("");
    setChecked(false);
    setResults([]);
    setTesting(true);
  }

  function checkAnswer() {
    if (checked) return;
    const q = quiz[qIndex];
    const ok = normalize(answer) !== "" && normalize(answer) === normalize(q.word);
    setResults((r) => [...r, { card: q, your: answer, ok }]);
    setChecked(true);
  }

  function nextQuestion() {
    setChecked(false);
    setAnswer("");
    setQIndex((i) => i + 1);
  }

  if (cards.length === 0) {
    return (
      <p className="text-center text-slate-500">{t("allRemoved")}</p>
    );
  }

  if (total === 0) {
    return (
      <p className="text-center text-slate-500">{t("noWordsSelected")}</p>
    );
  }

  // ---------- TEST MODE ----------
  if (testing) {
    const done = qIndex >= quiz.length;

    if (done) {
      const score = results.filter((r) => r.ok).length;
      const wrong = results.filter((r) => !r.ok);
      const pct = Math.round((score / quiz.length) * 100);
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-slate-400">{t("yourScore")}</p>
            <p className="text-5xl font-extrabold tracking-tight text-slate-900">
              {score}/{quiz.length}
            </p>
            <p
              className={`text-sm font-semibold ${
                pct >= 80
                  ? "text-green-600"
                  : pct >= 50
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {pct}% {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
            </p>
          </div>

          {wrong.length > 0 && (
            <div className="w-full">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {t("review")} ({wrong.length})
              </p>
              <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200 bg-white/80">
                {wrong.map((r, i) => (
                  <li key={i} className="px-4 py-2.5 text-sm">
                    <span className="font-semibold text-slate-800">
                      {r.card.word}
                    </span>{" "}
                    <span className="text-slate-400">— {r.card.meaning}</span>
                    <div className="text-xs text-red-500">
                      {t("youWrote")} {r.your || "—"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex w-full gap-3">
            <button
              onClick={startTest}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
            >
              {t("retry")}
            </button>
            <button
              onClick={() => setTesting(false)}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
            >
              {t("backToStudy")}
            </button>
          </div>
        </div>
      );
    }

    const q = quiz[qIndex];
    const lastResult = results[results.length - 1];
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-5">
        <div className="flex w-full items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {qIndex + 1} / {quiz.length}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${(qIndex / quiz.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setTesting(false)}
            className="shrink-0 text-xs text-slate-400 hover:text-slate-700"
          >
            {t("quit")}
          </button>
        </div>

        <div className="flex min-h-44 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            {t("typeWordThatMeans")}
          </span>
          <span className="text-2xl font-bold break-words text-slate-900">
            {q.meaning}
          </span>
          {q.explanation && (
            <span className="text-xs text-slate-400">{q.explanation}</span>
          )}
        </div>

        <input
          autoFocus
          value={answer}
          disabled={checked}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (checked) nextQuestion();
              else checkAnswer();
            }
          }}
          placeholder={t("yourAnswer")}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
        />

        {checked && lastResult && (
          <div
            className={`w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${
              lastResult.ok
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {lastResult.ok ? t("correct") : `${t("answerIs")} ${q.word}`}
          </div>
        )}

        {!checked ? (
          <button
            onClick={checkAnswer}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
          >
            {t("check")}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
          >
            {qIndex + 1 >= quiz.length ? t("seeResult") : t("next")}
          </button>
        )}
      </div>
    );
  }

  // ---------- STUDY MODE ----------
  const card = studyCards[ci];
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
    setCards((cs) => cs.filter((c) => c.id !== card.id));
    setSelectedIds((s) => {
      const n = new Set(s);
      n.delete(card.id);
      return n;
    });
    setRevealed(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-slate-400">
          {ci + 1} / {total}
          {selectedOnly && selectedIds.size > 0 && (
            <span className="ml-1 text-indigo-500">(selected)</span>
          )}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${((ci + 1) / total) * 100}%` }}
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
          {revealed ? t("tapHide") : t("tapReveal")}
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
          {t("speak")}
        </button>
        <span>
          {t("addedBy")} {card.authorName}
        </span>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? t("deleting") : t("delete")}
          </button>
        )}
      </div>

      <div className="flex w-full max-w-md gap-3">
        <button
          onClick={prev}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
        >
          {t("prev")}
        </button>
        <button
          onClick={next}
          className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
        >
          {t("next")}
        </button>
      </div>

      {/* test the current set */}
      <button
        onClick={startTest}
        className="w-full max-w-md rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
      >
        {selectedIds.size > 0 ? t("testPicked") : t("testMemory")} (
        {testSet.length} {testSet.length === 1 ? t("word") : t("words")})
      </button>

      <p className="hidden text-center text-xs text-slate-400 sm:block">
        {t("tip")}
      </p>

      {/* word list — pick the words to learn, or jump to any one */}
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {t("allWords")} ({cards.length})
            {selectedIds.size > 0 && (
              <span className="ml-1 text-indigo-500">
                · {selectedIds.size} {t("picked")}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={() => {
                  setSelectedOnly((v) => !v);
                  setIndex(0);
                  setRevealed(false);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  selectedOnly
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {selectedOnly
                  ? t("studyingPicked")
                  : `${t("studyPicked")} (${selectedIds.size})`}
              </button>
            )}
            {selectedIds.size > 0 && (
              <button
                onClick={() => {
                  setSelectedIds(new Set());
                  setSelectedOnly(false);
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:text-slate-700"
              >
                {t("clear")}
              </button>
            )}
          </div>
        </div>

        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200 bg-white/80">
          {cards.map((c) => {
            const isCurrent = c.id === card.id;
            const picked = selectedIds.has(c.id);
            return (
              <li key={c.id}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 transition ${
                    isCurrent ? "bg-indigo-50" : "hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={picked}
                    onChange={() => toggleSelect(c.id)}
                    aria-label={`Pick ${c.word}`}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                  />
                  <span
                    className="h-3 w-3 shrink-0 rounded-full ring-1 ring-slate-200"
                    style={{ backgroundColor: c.color }}
                  />
                  <button
                    onClick={() => jumpTo(c.id)}
                    className="flex min-w-0 flex-1 flex-col text-left"
                  >
                    <span
                      className={`truncate text-sm font-semibold ${
                        isCurrent ? "text-indigo-700" : "text-slate-800"
                      }`}
                    >
                      {c.word}
                    </span>
                    <span className="truncate text-xs text-slate-400">
                      {c.meaning}
                    </span>
                  </button>
                  <button
                    onClick={() => speakText(c.word, c.lang)}
                    aria-label={`Speak ${c.word}`}
                    className="shrink-0 rounded-md px-2 py-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    🔊
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
