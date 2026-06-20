"use client";

import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";

export function DeckHeader({
  deckName,
  count,
}: {
  deckName: string;
  count: number;
}) {
  const { t } = useLang();
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          {t("allDecks")}
        </Link>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/add"
            className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 active:scale-95"
          >
            {t("addCard")}
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {deckName}
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
