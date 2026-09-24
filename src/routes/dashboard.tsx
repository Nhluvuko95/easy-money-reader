import { createFileRoute, Link } from "@tanstack/react-router";
import { CopyCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { CategoryIcon, MoneyCard, TransactionRow } from "@/components/money";
import { allTransactions, findDuplicates, spendingByCategory, totals } from "@/lib/analysis";
import { formatRand } from "@/lib/money";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your money summary — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "Big, clear cards showing your total money in, money out, biggest spending groups and possible double charges in Rand.",
      },
      { property: "og:title", content: "Your money summary" },
      {
        property: "og:description",
        content: "Money in, money out, top spending groups and possible double charges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { statements, clearedDuplicateIds } = useAppState();
  const txns = allTransactions(statements);
  const { moneyIn, moneyOut, left } = totals(txns);
  const groups = spendingByCategory(txns).slice(0, 3);
  const duplicates = findDuplicates(txns).filter((p) => !clearedDuplicateIds.includes(p.id));
  const recent = txns.slice(0, 6);

  return (
    <AppShell
      title="Your money summary"
      subtitle={`From ${statements.length} statement${statements.length === 1 ? "" : "s"}`}
      back={{ to: "/", label: "Back to home" }}
    >
      <div className="grid gap-4">
        <MoneyCard label="Total money in" amount={moneyIn} tone="in" />
        <MoneyCard label="Total money out" amount={moneyOut} tone="out" />
        <MoneyCard
          label="What is left"
          amount={left}
          tone="neutral"
          signed
          note={left < 0 ? "You spent more than you received." : "Money in less money out."}
        />
      </div>

      {duplicates.length > 0 ? (
        <Link
          to="/duplicates"
          className="card-soft mt-6 flex items-center gap-4 bg-warning-soft p-5"
        >
          <CopyCheck className="size-10 shrink-0 text-warning" aria-hidden />
          <div>
            <p className="text-2xl font-bold text-warning">
              {duplicates.length} possible duplicate{duplicates.length === 1 ? "" : "s"}
            </p>
            <p className="text-base text-muted-foreground">Tap to look at them one by one.</p>
          </div>
        </Link>
      ) : null}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Where your money went</h2>
        <ul className="mt-4 space-y-4">
          {groups.map((g) => (
            <li key={g.key}>
              <Link
                to="/categories/$category"
                params={{ category: g.key }}
                className="card-soft block p-5"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                    <CategoryIcon name={g.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-bold">{g.label}</p>
                    <p className="text-base text-muted-foreground">
                      {g.count} payment{g.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-spend">{formatRand(g.total)}</p>
              </Link>
            </li>
          ))}
        </ul>
        <BigLink to="/categories" variant="secondary" className="mt-4">
          See all groups
        </BigLink>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Recent activity</h2>
        <ul className="mt-4 space-y-4">
          {recent.map((t) => (
            <TransactionRow key={t.id} txn={t} />
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
