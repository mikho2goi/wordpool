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
    <div className="flex items-center gap-3">
      {loggedIn && (
        <Link
          href="/tests"
          className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          {t("myTests")}
        </Link>
      )}
      <LangToggle />
    </div>
  );
}
