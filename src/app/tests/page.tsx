import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/userAuth";
import TestsView, { type SavedTestItem } from "./TestsView";

export const dynamic = "force-dynamic";

export default async function TestsPage() {
  const user = await getCurrentUser();

  let tests: SavedTestItem[] | null = null;
  if (user) {
    const rows = await prisma.savedTest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    const deckIds = [...new Set(rows.map((r) => r.deckId))];
    const decks = await prisma.deck.findMany({
      where: { id: { in: deckIds } },
      select: { id: true, name: true },
    });
    const deckName = new Map(decks.map((d) => [d.id, d.name]));
    tests = rows.map((r) => {
      let count = 0;
      try {
        count = (JSON.parse(r.cardIds) as number[]).length;
      } catch {}
      return {
        id: r.id,
        name: r.name,
        deckId: r.deckId,
        deckName: deckName.get(r.deckId) ?? "—",
        count,
      };
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <TestsView tests={tests} />
    </main>
  );
}
