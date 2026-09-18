import { createFileRoute } from "@tanstack/react-router";
import { CopyCheck, Camera, Eye, ShieldCheck, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { MoneyCard } from "@/components/money";
import { allTransactions, findDuplicates, totals } from "@/lib/analysis";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Old Age Bank Statement Analysis — Understand your money easily" },
      {
        name: "description",
        content:
          "A simple, large-print app for people 55 and older. Upload a bank statement and see your money grouped, ranked and checked for double charges in Rand.",
      },
      { property: "og:title", content: "Old Age Bank Statement Analysis" },
      {
        property: "og:description",
        content:
          "Upload a bank statement and see your money grouped, ranked and checked for double charges — in large, easy-to-read print.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { statements } = useAppState();
  const txns = allTransactions(statements);
  const { moneyIn, moneyOut } = totals(txns);
  const duplicates = findDuplicates(txns);

  return (
    <AppShell
      title="Welcome back"
      subtitle="Let us look at your bank statement together."
    >
      <section className="space-y-4">
        <BigLink to="/upload">
          <Upload className="size-8 shrink-0" aria-hidden />
          Upload a statement
        </BigLink>
        <BigLink to="/dashboard" variant="secondary">
          <Eye className="size-8 shrink-0" aria-hidden />
          See my money summary
        </BigLink>
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-2xl font-bold">Your statements so far</h2>
        <MoneyCard label="Total money in" amount={moneyIn} tone="in" />
        <MoneyCard label="Total money out" amount={moneyOut} tone="out" />
        <div className="card-soft flex items-center gap-4 bg-warning-soft p-5">
          <CopyCheck className="size-10 shrink-0 text-warning" aria-hidden />
          <div className="min-w-0">
            <p className="text-2xl font-bold text-warning">
              {duplicates.length} possible duplicate{duplicates.length === 1 ? "" : "s"}
            </p>
            <p className="text-base text-muted-foreground">
              Payments that look like they were charged twice.
            </p>
          </div>
        </div>
        <BigLink to="/duplicates" variant="secondary">
          Check the duplicates
        </BigLink>
      </section>

      <section className="mt-8 card-soft p-5">
        <div className="flex items-start gap-4">
          <ShieldCheck className="size-10 shrink-0 text-success" aria-hidden />
          <div>
            <h2 className="text-2xl font-bold">You are safe here</h2>
            <p className="mt-2 text-lg">
              This app only <strong>reads</strong> your statement. It cannot move money, make
              payments, or ask for your bank password. Your account number is always hidden, and
              you can delete any statement at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 card-soft p-5">
        <div className="flex items-start gap-4">
          <Camera className="size-10 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-2xl font-bold">New here?</h2>
            <p className="mt-2 text-lg">
              We have already loaded {statements.length} example South African statements so you
              can try everything before using your own.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
