"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import TopNav from "@/app/TopNav";
import { parseDeckName, langLabel, targetLabel } from "@/lib/deckMeta";

export function DeckHeader({
  deckName,
  count,
  fromLang,
  level: levelProp,
  targetLang,
}: {
  deckName: string;
  count: number;
  fromLang?: string | null;
  level?: string | null;
  targetLang?: string | null;
}) {
  const { t } = useLang();
  const meta = parseDeckName(deckName);
  const from = langLabel(fromLang);
  const level = levelProp ?? meta.level;
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          {t("allDecks")}
        </Link>
        <div className="flex items-center gap-3">
          <TopNav />
          <Link
            href="/add"
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:scale-95"
          >
            {t("addCard")}
          </Link>
        </div>
      </div>

      <div className="mb-1 flex flex-wrap items-center gap-2">
        {from && (
          <span className="text-xs font-medium text-slate-500">
            {from} <span className="text-slate-300">→</span>{" "}
            {targetLabel(targetLang)}
          </span>
        )}
        {level && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
            {level}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight break-words text-slate-900 sm:text-4xl">
        {meta.title}
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-500">
        {count} {count === 1 ? t("word") : t("words")}
      </p>
    </>
  );
}

export function EmptyDeck() {
  const { t } = useLang();
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
      <p className="text-slate-500">
        {t("noCardsDeck")}{" "}
        <Link href="/add" className="font-medium text-indigo-600 underline">
          {t("addOne")}
        </Link>
        .
      </p>
    </div>
  );
}
