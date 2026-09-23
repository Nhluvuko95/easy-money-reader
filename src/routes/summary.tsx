import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon } from "@/components/money";
import { spendingByCategory, totals, allTransactions } from "@/lib/analysis";
import { formatMonth, formatRand } from "@/lib/money";
import { useAppState } from "@/lib/store";
import type { Transaction } from "@/lib/types";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Month by month — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "A simple month-by-month view of your money in, money out, what is left and your top three spending groups in Rand.",
      },
      { property: "og:title", content: "Your month-by-month summary" },
      {
        property: "og:description",
        content: "Money in, money out and what is left, one month at a time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const { statements } = useAppState();
  const txns = allTransactions(statements);

  const months = new Map<string, Transaction[]>();
  for (const t of txns) {
    const key = t.date.slice(0, 7);
    const list = months.get(key) ?? [];
    list.push(t);
    months.set(key, list);
  }
  const ordered = [...months.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <AppShell title="Month by month" subtitle="How your money moved each month.">
      {ordered.length === 0 ? (
        <p className="text-xl">No transactions yet.</p>
      ) : (
        <ul className="space-y-6">
          {ordered.map(([month, list]) => {
            const { moneyIn, moneyOut, left } = totals(list);
            const top = spendingByCategory(list).slice(0, 3);
            return (
              <li key={month} className="card-soft p-5">
                <h2 className="text-2xl font-bold">{formatMonth(`${month}-01`)}</h2>
                <dl className="mt-4 grid gap-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-lg font-bold text-muted-foreground">Money in</dt>
                    <dd className="text-2xl font-bold text-success">{formatRand(moneyIn)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-lg font-bold text-muted-foreground">Money out</dt>
                    <dd className="text-2xl font-bold text-spend">{formatRand(moneyOut)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t-2 border-border pt-3">
                    <dt className="text-lg font-bold text-muted-foreground">What is left</dt>
                    <dd className="text-2xl font-bold">{formatRand(left, { signed: true })}</dd>
                  </div>
                </dl>

                {top.length > 0 ? (
                  <div className="mt-5">
                    <h3 className="text-xl font-bold">Top three groups</h3>
                    <ul className="mt-3 space-y-3">
                      {top.map((g) => (
                        <li key={g.key} className="flex items-center gap-3">
                          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                            <CategoryIcon name={g.icon} className="size-6" />
                          </span>
                          <span className="min-w-0 flex-1 text-lg font-bold">{g.label}</span>
                          <span className="shrink-0 text-lg font-bold text-spend">
                            {formatRand(g.total)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
