"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import {
  parseDeckName,
  langLabel,
  targetLabel,
  LEVEL_OPTIONS,
} from "@/lib/deckMeta";
import { LANGUAGES } from "@/lib/langs";

type Deck = {
  id: number;
  name: string;
  level: string | null;
  targetLang: string | null;
  cardCount: number;
  colors: string[];
  fromLang: string | null;
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

  // inline admin edit of a deck's name + level
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = q
    ? decks.filter((d) => d.name.toLowerCase().includes(q))
    : decks;

  function openEdit(deck: Deck) {
    setEditId(deck.id);
    setEditName(deck.name);
    setEditLevel(deck.level ?? "");
    setEditSource(deck.fromLang ?? "en-US");
    setEditTarget(deck.targetLang ?? "vi-VN");
  }

  async function saveEdit(deck: Deck) {
    const name = editName.trim();
    if (!name) return;
    setSavingEdit(true);
    const res = await fetch(`/api/decks/${deck.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        level: editLevel || null,
        sourceLang: editSource || null,
        targetLang: editTarget || null,
      }),
    });
    setSavingEdit(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Save failed.");
      return;
    }
    setEditId(null);
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
          {shown.map((deck) => {
          const meta = parseDeckName(deck.name);
          const from = langLabel(deck.fromLang);
          const level = deck.level ?? meta.level;
          if (editId === deck.id) {
            return (
              <li
                key={deck.id}
                className="rounded-2xl border border-indigo-300 bg-white p-5 shadow-sm"
              >
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  {t("deckNameLabel")}
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={60}
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <label className="mb-1 mt-3 block text-xs font-semibold text-slate-500">
                  {t("levelLabel")}
                </label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">{t("levelNone")}</option>
                  {LEVEL_OPTIONS.map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
                <label className="mb-1 mt-3 block text-xs font-semibold text-slate-500">
                  {t("fromLangLabel")}
                </label>
                <select
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <label className="mb-1 mt-3 block text-xs font-semibold text-slate-500">
                  {t("toLangLabel")}
                </label>
                <select
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveEdit(deck)}
                    disabled={savingEdit}
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
                  >
                    {savingEdit ? t("saving") : t("save")}
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </li>
            );
          }
          return (
        <li key={deck.id} className="relative min-w-0">
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
            <h2 className="truncate pr-12 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
              {meta.title}
            </h2>
            {from && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                <span className="truncate">{from}</span>
                <span className="shrink-0 text-slate-300">→</span>
                <span className="truncate">{targetLabel(deck.targetLang)}</span>
              </p>
            )}
            {level && (
              <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                {level}
              </span>
            )}
            <p className="mt-2 text-sm text-slate-500">
              {deck.cardCount} {deck.cardCount === 1 ? t("word") : t("words")}
            </p>
          </Link>

          {isAdmin && (
            <div className="absolute right-3 top-3 flex gap-1.5">
              <button
                onClick={() => openEdit(deck)}
                aria-label={`Edit deck ${deck.name}`}
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
          );
          })}
        </ul>
      )}
    </div>
  );
}
