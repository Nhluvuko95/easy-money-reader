import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { parseUploadedStatement } from "@/lib/demo-data";
import { addStatement } from "@/lib/store";

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

function ProcessingPage() {
  const { name } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), (i + 1) * 900));
    const done = window.setTimeout(() => {
      addStatement(parseUploadedStatement(name));
      navigate({ to: "/dashboard" });
    }, STEPS.length * 900 + 700);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [name, navigate]);

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
        This takes only a few seconds. Please do not close the page.
      </p>
    </AppShell>
  );
}
