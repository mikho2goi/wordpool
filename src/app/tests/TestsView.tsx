"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang, LangToggle } from "@/lib/i18n";

export type SavedTestItem = {
  id: number;
  name: string;
  deckId: number;
  deckName: string;
  count: number;
};

export default function TestsView({
  tests,
}: {
  tests: SavedTestItem[] | null;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function remove(id: number) {
    if (!confirm("Delete this saved test?")) return;
    setDeletingId(id);
    await fetch(`/api/tests/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          {t("allDecks")}
        </Link>
        <LangToggle />
      </div>

      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {t("myTests")}
      </h1>

      {tests === null ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <p className="text-slate-500">
            <Link href="/account" className="font-medium text-indigo-600 underline">
              {t("signIn")}
            </Link>
          </p>
        </div>
      ) : tests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <p className="text-slate-500">{t("noSavedTests")}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tests.map((test) => (
            <li
              key={test.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {test.name}
                </p>
                <p className="text-xs text-slate-400">
                  {test.deckName} · {test.count}{" "}
                  {test.count === 1 ? t("word") : t("words")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/deck/${test.deckId}?test=${test.id}`}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                >
                  {t("retake")}
                </Link>
                <button
                  onClick={() => remove(test.id)}
                  disabled={deletingId === test.id}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
