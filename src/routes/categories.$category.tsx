import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TransactionRow } from "@/components/money";
import { allTransactions } from "@/lib/analysis";
import { CATEGORIES, categoryFromSlug } from "@/lib/categories";
import { formatRand } from "@/lib/money";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/categories/$category")({
  head: ({ params }) => {
    const key = categoryFromSlug(params.category);
    const label = key ? CATEGORIES[key].label : "Group";
    const plain = key ? CATEGORIES[key].plain : "Payments in this group.";
    return {
      meta: [
        { title: `${label} — Old Age Bank Statement Analysis` },
        { name: "description", content: plain },
        { property: "og:title", content: `${label} — your payments` },
        { property: "og:description", content: plain },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const { category } = Route.useParams();
  const { statements } = useAppState();
  const key = categoryFromSlug(category);
  const info = key ? CATEGORIES[key] : undefined;
  const txns = allTransactions(statements).filter((t) => t.category === key);
  const total = txns.reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <AppShell
      title={info?.label ?? "Group not found"}
      subtitle={info?.plain}
      back={{ to: "/categories", label: "Back to groups" }}
    >
      {!info ? (
        <p className="text-xl">We could not find that group.</p>
      ) : (
        <>
          <div className="card-soft p-5">
            <p className="text-lg font-bold text-muted-foreground">Total in this group</p>
            <p className="mt-1 text-4xl font-bold">{formatRand(total)}</p>
            <p className="mt-1 text-base text-muted-foreground">
              {txns.length} transaction{txns.length === 1 ? "" : "s"}
            </p>
          </div>

          <ul className="mt-6 space-y-4">
            {txns.map((t) => (
              <TransactionRow key={t.id} txn={t} />
            ))}
          </ul>
        </>
      )}
    </AppShell>
  );
}
