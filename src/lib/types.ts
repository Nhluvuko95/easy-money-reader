import type { CategoryKey } from "./categories";

export type Transaction = {
  id: string;
  statementId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  description: string;
  amount: number; // negative = money out, positive = money in
  category: CategoryKey;
};

export type Statement = {
  id: string;
  bank: string;
  accountMasked: string;
  holder: string;
  periodStart: string;
  periodEnd: string;
  source: "demo" | "upload";
  fileName?: string;
  addedAt: string;
  transactions: Transaction[];
};

export type DuplicatePair = {
  id: string;
  a: Transaction;
  b: Transaction;
  reason: string;
};
