import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Check, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BigLink } from "@/components/BigButton";
import { categorise } from "@/lib/categories";
import { fileToBase64, takePendingUpload } from "@/lib/pending-upload";
import { readStatement, type ReadStatementResult } from "@/lib/statement-reader.functions";
import { addStatement } from "@/lib/store";
import type { Statement } from "@/lib/types";

const STEPS = [
  "Opening your statement",
  "Reading the dates and amounts",
  "Putting your money into groups",
  "Looking for double charges",
];

export const Route = createFileRoute("/processing")({
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search["name"] === "string" ? (search["name"] as string) : "statement.pdf",
  }),
  head: () => ({
    meta: [
      { title: "Reading your statement — Old Age Bank Statement Analysis" },
      {
        name: "description",
        content: "Please wait while we read your bank statement and group your transactions.",
      },
      { property: "og:title", content: "Reading your statement" },
      { property: "og:description", content: "We are grouping your transactions for you." },
    ],
  }),
  component: ProcessingPage,
});

function toStatement(r: ReadStatementResult, fileName: string): Statement {
  const id = `upload-${Date.now()}`;
  const dates = r.transactions.map((t) => t.date).sort();
  const today = new Date().toISOString().slice(0, 10);
  return {
    id,
    bank: r.bank?.trim() || "Your bank",
    accountMasked: r.accountLast4 ? `**** **** ${r.accountLast4.slice(-4)}` : "**** **** ****",
    holder: r.holder?.trim() || "",
    periodStart: r.periodStart || dates[0] || today,
    periodEnd: r.periodEnd || dates[dates.length - 1] || today,
    source: "upload",
    fileName,
    addedAt: new Date().toISOString(),
    transactions: r.transactions.map((t, i) => ({
      id: `${id}-t${i + 1}`,
      statementId: id,
      date: t.date,
      time: t.time ?? undefined,
      description: t.description,
      amount: t.amount,
      category: categorise(t.description, t.amount),
    })),
  };
}

function ProcessingPage() {
  const { name } = Route.useSearch();
  const navigate = useNavigate();
  const read = useServerFn(readStatement);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const file = takePendingUpload();
    if (!file) {
      setError("We could not find your file. Please choose it again.");
      return;
    }
    const tick = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 4000);
    (async () => {
      try {
        const base64 = await fileToBase64(file);
        const result = await read({
          data: { fileName: file.name, mediaType: file.type || "application/pdf", base64 },
        });
        if (!result.isBankStatement || result.transactions.length === 0) {
          setError(
            "This does not look like a bank statement, or we could not see any transactions. Please try a clearer copy.",
          );
          return;
        }
        setStep(STEPS.length);
        addStatement(toStatement(result, file.name));
        navigate({ to: "/dashboard" });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong while reading.");
      } finally {
        window.clearInterval(tick);
      }
    })();
    return () => window.clearInterval(tick);
  }, [read, navigate]);

  if (error) {
    return (
      <AppShell title="We could not read it" subtitle="Nothing was saved.">
        <div className="card-soft flex items-start gap-4 p-5">
          <AlertTriangle className="size-10 shrink-0 text-spend" aria-hidden />
          <p className="text-xl">{error}</p>
        </div>
        <BigLink to="/upload" className="mt-6">
          <RotateCcw className="size-8 shrink-0" aria-hidden />
          Try again
        </BigLink>
      </AppShell>
    );
  }

  return (
    <AppShell title="Please wait" subtitle="We are reading your statement now.">
      <p className="text-xl">
        File: <strong className="break-all">{name}</strong>
      </p>

      <ul className="mt-6 space-y-4">
        {STEPS.map((label, i) => {
          const done = i < step;
          return (
            <li
              key={label}
              className="card-soft flex items-center gap-4 p-5"
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={
                  done
                    ? "grid size-12 shrink-0 place-items-center rounded-full bg-success text-success-foreground"
                    : "grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary"
                }
              >
                {done ? (
                  <Check className="size-7" aria-hidden />
                ) : (
                  <Loader2 className="size-7 animate-spin" aria-hidden />
                )}
              </span>
              <span className="text-xl font-bold">{label}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-lg text-muted-foreground">
        This can take up to a minute. Please do not close the page.
      </p>
    </AppShell>
  );
}
