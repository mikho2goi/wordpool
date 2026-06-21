"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang, LangToggle } from "@/lib/i18n";

// Shared top-right nav: language toggle (always) + My tests (when logged in).
// Self-detects login so it can drop into any page.
export default function TopNav() {
  const { t } = useLang();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d?.user))
      .catch(() => {});
  }, []);

  return (
    <nav className="flex items-center gap-2">
      {loggedIn && (
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md active:scale-95"
        >
          <span aria-hidden>📝</span>
          {t("myTests")}
        </Link>
      )}
      <LangToggle />
    </nav>
  );
}
