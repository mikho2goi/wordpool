"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBar({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!isAdmin) {
    return (
      <Link
        href="/login"
        className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
      >
        Admin
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
    <div className="flex items-center gap-2 text-xs">
      <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700">
        admin
      </span>
      <button
        onClick={logout}
        disabled={busy}
        className="font-medium text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
      >
        log out
      </button>
    </div>
  );
}
