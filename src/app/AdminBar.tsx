"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function AdminBar({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const { t } = useLang();
  const [busy, setBusy] = useState(false);

  if (!isAdmin) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-700 hover:shadow-md active:scale-95"
      >
        {t("admin")}
      </Link>
    );
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50/80 py-1 pl-3 pr-1 text-xs shadow-sm backdrop-blur">
      <span className="flex items-center gap-1 font-semibold text-green-700">
        <span aria-hidden>🛡️</span>
        {t("adminBadge")}
      </span>
      <button
        onClick={logout}
        disabled={busy}
        className="rounded-full px-2 py-1 font-medium text-green-600 transition hover:bg-green-100 hover:text-green-800 disabled:opacity-50"
      >
        {t("exitAdmin")}
      </button>
    </div>
  );
}
