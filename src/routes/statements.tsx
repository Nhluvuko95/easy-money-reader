import { createFileRoute } from "@tanstack/react-router";
import { Landmark, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BigButton, BigLink } from "@/components/BigButton";
import { totals } from "@/lib/analysis";
import { formatDateLong, formatRand } from "@/lib/money";
import { deleteStatement, restoreDemoStatements, useAppState } from "@/lib/store";

export const Route = createFileRoute("/statements")({
  head: () => ({
    meta: [
      { title: "Your statements — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content:
          "Every statement you have added, with the bank name, hidden account number and dates. Delete any statement whenever you want.",
      },
      { property: "og:title", content: "Your statements" },
      {
        property: "og:description",
        content: "See and delete the bank statements saved on this device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatementsPage,
});

function StatementsPage() {
  const { statements } = useAppState();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <AppShell title="Your statements" subtitle="Only you can see these. Delete any time.">
      <BigLink to="/upload">Add another statement</BigLink>

      {statements.length === 0 ? (
        <div className="card-soft mt-6 p-5">
          <p className="text-xl">You have no statements saved.</p>
          <BigButton variant="secondary" className="mt-4" onClick={restoreDemoStatements}>
            <RotateCcw className="size-8 shrink-0" aria-hidden />
            Bring back the examples
          </BigButton>
        </div>
      ) : (
        <ul className="mt-6 space-y-6">
          {statements.map((s) => {
            const { moneyIn, moneyOut } = totals(s.transactions);
            return (
              <li key={s.id} className="card-soft p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                    <Landmark className="size-8 shrink-0" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-2xl font-bold">{s.bank}</p>
                    <p className="text-lg">{s.accountMasked}</p>
                    <p className="text-base text-muted-foreground">
                      {formatDateLong(s.periodStart)} to {formatDateLong(s.periodEnd)}
                    </p>
                    <p className="mt-2 text-base text-muted-foreground">
                      {s.transactions.length} transactions • in {formatRand(moneyIn)} • out{" "}
                      {formatRand(moneyOut)}
                    </p>
                    {s.source === "demo" ? (
                      <p className="mt-2 inline-block rounded-xl bg-secondary px-3 py-1 text-base font-bold">
                        Example statement
                      </p>
                    ) : null}
                  </div>
                </div>

                {confirmId === s.id ? (
                  <div className="mt-4 rounded-2xl bg-spend-soft p-4">
                    <p className="text-lg font-bold text-spend">
                      Delete this statement and everything in it?
                    </p>
                    <div className="mt-4 grid gap-3">
                      <BigButton variant="danger" onClick={() => deleteStatement(s.id)}>
                        Yes, delete it
                      </BigButton>
                      <BigButton variant="secondary" onClick={() => setConfirmId(null)}>
                        No, keep it
                      </BigButton>
                    </div>
                  </div>
                ) : (
                  <BigButton
                    variant="danger"
                    className="mt-4"
                    onClick={() => setConfirmId(s.id)}
                  >
                    <Trash2 className="size-8 shrink-0" aria-hidden />
                    Delete this statement
                  </BigButton>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
