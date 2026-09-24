import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CategoryIcon } from "@/components/money";
import { allTransactions, spendingByCategory } from "@/lib/analysis";
import { formatRand } from "@/lib/money";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Spending groups — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "Your spending sorted into simple groups: debit orders, cash withdrawals, shopping, online payments, money sent and bank charges.",
      },
      { property: "og:title", content: "Your spending groups" },
      {
        property: "og:description",
        content: "See which groups take the most of your money, from biggest to smallest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { statements } = useAppState();
  const groups = spendingByCategory(allTransactions(statements));

  return (
    <AppShell
      title="Spending groups"
      subtitle="Biggest first. Tap a group to see every payment."
      back={{ to: "/dashboard", label: "Back to summary" }}
    >
      {groups.length === 0 ? (
        <p className="text-xl">No spending found yet.</p>
      ) : (
        <ul className="space-y-4">
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
                    <p className="text-base text-muted-foreground">{g.plain}</p>
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-spend">{formatRand(g.total)}</p>
                <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, Math.round(g.share * 100))}%` }}
                  />
                </div>
                <p className="mt-2 text-base text-muted-foreground">
                  {Math.round(g.share * 100)}% of your spending • {g.count} payment
                  {g.count === 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
