"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function UserBar({ username }: { username: string | null }) {
  const router = useRouter();
  const { t } = useLang();
  const [busy, setBusy] = useState(false);

  if (!username) {
    return (
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
      >
        <span aria-hidden>👤</span>
        {t("signIn")}
      </Link>
    );
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/account/logout", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 py-1 pl-3 pr-1 text-xs shadow-sm backdrop-blur">
      <span className="flex items-center gap-1 font-semibold text-slate-700">
        <span aria-hidden>👤</span>
        {username}
      </span>
      <button
        onClick={logout}
        disabled={busy}
        className="rounded-full px-2 py-1 font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
      >
        {t("logout")}
      </button>
    </div>
  );
}
