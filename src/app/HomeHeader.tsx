"use client";

import Link from "next/link";
import { useLang, LangToggle } from "@/lib/i18n";
import AdminBar from "./AdminBar";
import UserBar from "./UserBar";

export default function HomeHeader({
  isAdmin,
  username,
}: {
  isAdmin: boolean;
  username: string | null;
}) {
  const { t } = useLang();
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          WordPool
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{t("tagline")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <LangToggle />
        {username && (
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md active:scale-95"
          >
            <span aria-hidden>📝</span>
            {t("myTests")}
          </Link>
        )}
        <UserBar username={username} />
        <AdminBar isAdmin={isAdmin} />
        <Link
          href="/add"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:scale-95"
        >
          {t("addCard")}
        </Link>
      </div>
    </header>
  );
}
