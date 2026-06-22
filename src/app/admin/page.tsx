import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/day";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/login");

  const day = todayKey();
  const [agg, today, users, cards, decks] = await Promise.all([
    prisma.dailyView.aggregate({ _sum: { count: true } }),
    prisma.dailyView.findUnique({ where: { day } }),
    prisma.user.count(),
    prisma.card.count(),
    prisma.deck.count(),
  ]);

  const total = agg._sum.count ?? 0;
  const todayCount = today?.count ?? 0;

  const stats: { label: string; value: number; hint?: string }[] = [
    { label: "Total page views", value: total, hint: "since tracking started" },
    { label: "Views today", value: todayCount, hint: day },
    { label: "Registered users", value: users },
    { label: "Cards", value: cards },
    { label: "Decks", value: decks },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          🛡️ Admin dashboard
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
              {s.value.toLocaleString()}
            </div>
            <div className="mt-1 text-sm font-medium text-slate-600">
              {s.label}
            </div>
            {s.hint && (
              <div className="mt-0.5 text-xs text-slate-400">{s.hint}</div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Page views count visits that run JavaScript (real users), grouped by day
        in Asia/Ho_Chi_Minh time.
      </p>
    </main>
  );
}
