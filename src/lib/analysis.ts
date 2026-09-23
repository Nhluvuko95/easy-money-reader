import { CATEGORIES, type CategoryKey } from "./categories";
import type { DuplicatePair, Statement, Transaction } from "./types";

export function allTransactions(statements: Statement[]): Transaction[] {
  return statements
    .flatMap((s) => s.transactions)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function totals(txns: Transaction[]) {
  const moneyIn = txns.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = txns.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return { moneyIn, moneyOut, left: moneyIn - moneyOut };
}

export type CategoryTotal = {
  key: CategoryKey;
  label: string;
  plain: string;
  icon: string;
  total: number;
  count: number;
  share: number;
};

export function spendingByCategory(txns: Transaction[]): CategoryTotal[] {
  const map = new Map<CategoryKey, { total: number; count: number }>();
  for (const t of txns) {
    if (t.amount >= 0) continue;
    const cur = map.get(t.category) ?? { total: 0, count: 0 };
    cur.total += Math.abs(t.amount);
    cur.count += 1;
    map.set(t.category, cur);
  }
  const grand = [...map.values()].reduce((s, v) => s + v.total, 0) || 1;
  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      label: CATEGORIES[key].label,
      plain: CATEGORIES[key].plain,
      icon: CATEGORIES[key].icon,
      total: v.total,
      count: v.count,
      share: v.total / grand,
    }))
    .sort((a, b) => b.total - a.total);
}

function normalise(desc: string): string[] {
  return desc
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function similarity(a: string, b: string): number {
  const wa = new Set(normalise(a));
  const wb = new Set(normalise(b));
  if (wa.size === 0 || wb.size === 0) return 0;
  let shared = 0;
  wa.forEach((w) => {
    if (wb.has(w)) shared += 1;
  });
  return shared / Math.max(wa.size, wb.size);
}

function daysApart(a: string, b: string): number {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return Math.round(ms / 86400000);
}

export function findDuplicates(txns: Transaction[]): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  const list = [...txns].sort((a, b) => (a.date < b.date ? -1 : 1));
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!;
      const b = list[j]!;
      if (a.amount >= 0 || b.amount >= 0) continue;
      const gap = daysApart(a.date, b.date);
      if (gap > 4) continue;
      const amountDiff = Math.abs(Math.abs(a.amount) - Math.abs(b.amount));
      const sameAmount = amountDiff < 0.01;
      const nearAmount = amountDiff <= Math.abs(a.amount) * 0.02;
      if (!sameAmount && !nearAmount) continue;
      const sim = similarity(a.description, b.description);
      if (sim < 0.6) continue;

      const reason =
        gap === 0
          ? sameAmount
            ? "Same shop and same amount on the same day"
            : "Same shop and almost the same amount on the same day"
          : `Same shop and ${sameAmount ? "same" : "almost the same"} amount, ${gap} day${gap === 1 ? "" : "s"} apart`;

      pairs.push({ id: `${a.id}__${b.id}`, a, b, reason });
    }
  }
  return pairs;
}
