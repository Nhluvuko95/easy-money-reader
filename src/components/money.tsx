import {
  Banknote,
  CalendarClock,
  CircleHelp,
  Globe,
  PiggyBank,
  Receipt,
  Send,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { formatDateShort, formatRand } from "@/lib/money";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  PiggyBank,
  CalendarClock,
  Banknote,
  ShoppingCart,
  Globe,
  Send,
  Receipt,
  CircleHelp,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? CircleHelp;
  return <Icon className={cn("size-8 shrink-0", className)} aria-hidden />;
}

export function MoneyCard({
  label,
  amount,
  tone,
  note,
  signed,
}: {
  label: string;
  amount: number;
  tone: "in" | "out" | "neutral";
  note?: string | undefined;
  signed?: boolean | undefined;
}) {
  return (
    <div
      className={cn(
        "card-soft p-5",
        tone === "in" && "bg-success-soft",
        tone === "out" && "bg-spend-soft",
      )}
    >
      <p className="text-lg font-bold text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-4xl font-bold",
          tone === "in" && "text-success",
          tone === "out" && "text-spend",
        )}
      >
        {signed ? formatRand(amount, { signed: true }) : formatRand(Math.abs(amount))}
      </p>
      {note ? <p className="mt-1 text-base text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export function TransactionRow({
  txn,
  flagged,
}: {
  txn: Transaction;
  flagged?: boolean;
}) {
  const info = CATEGORIES[txn.category as CategoryKey];
  return (
    <li className="card-soft flex items-start gap-4 p-4">
      <span
        className={cn(
          "mt-1 grid size-14 shrink-0 place-items-center rounded-2xl",
          txn.amount > 0 ? "bg-success-soft text-success" : "bg-secondary text-primary",
        )}
      >
        <CategoryIcon name={info.icon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold">{txn.description}</p>
        <p className="text-base text-muted-foreground">
          {formatDateShort(txn.date)}
          {txn.time ? ` • ${txn.time}` : ""} • {info.label}
        </p>
        {flagged ? (
          <p className="mt-2 inline-block rounded-xl bg-warning-soft px-3 py-1 text-base font-bold text-warning">
            Possible Duplicate
          </p>
        ) : null}
      </div>
      <p
        className={cn(
          "shrink-0 text-xl font-bold",
          txn.amount > 0 ? "text-success" : "text-spend",
        )}
      >
        {formatRand(txn.amount, { signed: true })}
      </p>
    </li>
  );
}
