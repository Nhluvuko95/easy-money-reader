import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CopyCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BigButton } from "@/components/BigButton";
import { allTransactions, findDuplicates } from "@/lib/analysis";
import { formatDateLong, formatRand } from "@/lib/money";
import { clearDuplicate, restoreDuplicate, useAppState } from "@/lib/store";
import type { Transaction } from "@/lib/types";

export const Route = createFileRoute("/duplicates")({
  head: () => ({
    meta: [
      { title: "Possible double charges — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "Payments that look like they were charged twice, shown side by side so you can decide if they are fine or need checking with your bank.",
      },
      { property: "og:title", content: "Possible double charges" },
      {
        property: "og:description",
        content: "See payments that may have been charged twice, side by side.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DuplicatesPage,
});

function Side({ txn, label }: { txn: Transaction; label: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-background p-4">
      <p className="text-base font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{txn.description}</p>
      <p className="text-base text-muted-foreground">
        {formatDateLong(txn.date)}
        {txn.time ? ` • ${txn.time}` : ""}
      </p>
      <p className="mt-2 text-2xl font-bold text-spend">{formatRand(Math.abs(txn.amount))}</p>
    </div>
  );
}

function DuplicatesPage() {
  const { statements, clearedDuplicateIds } = useAppState();
  const pairs = findDuplicates(allTransactions(statements));
  const open = pairs.filter((p) => !clearedDuplicateIds.includes(p.id));
  const cleared = pairs.filter((p) => clearedDuplicateIds.includes(p.id));

  return (
    <AppShell
      title="Possible double charges"
      subtitle="Look at each pair and tell us what you think."
    >
      {open.length === 0 ? (
        <div className="card-soft flex items-start gap-4 bg-success-soft p-5">
          <CheckCircle2 className="size-10 shrink-0 text-success" aria-hidden />
          <p className="text-xl font-bold text-success">
            Nothing to check right now. We found no payments charged twice.
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {open.map((p) => (
            <li key={p.id} className="card-soft p-5">
              <p className="inline-flex items-center gap-2 rounded-xl bg-warning-soft px-3 py-1 text-base font-bold text-warning">
                <CopyCheck className="size-6 shrink-0" aria-hidden />
                Possible Duplicate
              </p>
              <p className="mt-3 text-lg">{p.reason}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Side txn={p.a} label="First payment" />
                <Side txn={p.b} label="Second payment" />
              </div>
              <div className="mt-4 grid gap-3">
                <BigButton variant="success" onClick={() => clearDuplicate(p.id)}>
                  Looks fine to me
                </BigButton>
                <p className="text-base text-muted-foreground">
                  If you are not sure, leave it. It stays flagged so you can ask your bank.
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cleared.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">You said these are fine</h2>
          <ul className="mt-4 space-y-4">
            {cleared.map((p) => (
              <li key={p.id} className="card-soft p-5">
                <p className="text-xl font-bold">{p.a.description}</p>
                <p className="text-base text-muted-foreground">
                  {formatDateLong(p.a.date)} • {formatRand(Math.abs(p.a.amount))} (twice)
                </p>
                <BigButton
                  variant="secondary"
                  className="mt-4"
                  onClick={() => restoreDuplicate(p.id)}
                >
                  Flag it again
                </BigButton>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AppShell>
  );
}
