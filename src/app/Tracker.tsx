"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Records one page view per navigation. A ref guards against double-firing
// (React Strict Mode runs effects twice in dev; re-renders can re-run it too),
// so the same path is only counted once per mount.
export default function Tracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return; // already counted this path
    lastPath.current = pathname;
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
