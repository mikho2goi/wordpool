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
        className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
      >
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
    <div className="flex items-center gap-2 text-xs">
      <span className="font-semibold text-slate-700">{username}</span>
      <button
        onClick={logout}
        disabled={busy}
        className="font-medium text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
      >
        {t("logout")}
      </button>
    </div>
  );
}
