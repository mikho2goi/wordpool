"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Records one page view per navigation (fire-and-forget; failures ignored).
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
