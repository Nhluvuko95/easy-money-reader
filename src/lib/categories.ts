export type CategoryKey =
  | "income"
  | "debit-orders"
  | "atm"
  | "purchases"
  | "online"
  | "transfers"
  | "fees"
  | "other";

export type CategoryInfo = {
  key: CategoryKey;
  label: string;
  plain: string;
  icon: string;
};

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  income: {
    key: "income",
    label: "Money In",
    plain: "Grants, pensions and money people sent you",
    icon: "PiggyBank",
  },
  "debit-orders": {
    key: "debit-orders",
    label: "Debit Orders",
    plain: "Monthly payments taken off automatically",
    icon: "CalendarClock",
  },
  atm: {
    key: "atm",
    label: "Cash Withdrawals",
    plain: "Cash you took out at an ATM or a till",
    icon: "Banknote",
  },
  purchases: {
    key: "purchases",
    label: "Shopping",
    plain: "Card payments at shops, chemists and fuel",
    icon: "ShoppingCart",
  },
  online: {
    key: "online",
    label: "Online Payments",
    plain: "Payments you made on the internet or on your phone",
    icon: "Globe",
  },
  transfers: {
    key: "transfers",
    label: "Money Sent",
    plain: "Money you sent to other people or accounts",
    icon: "Send",
  },
  fees: {
    key: "fees",
    label: "Bank Charges",
    plain: "Fees the bank charged you",
    icon: "Receipt",
  },
  other: {
    key: "other",
    label: "Other",
    plain: "Anything we could not place in a group",
    icon: "CircleHelp",
  },
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "income",
  "debit-orders",
  "atm",
  "purchases",
  "online",
  "transfers",
  "fees",
  "other",
];

export function categoryFromSlug(slug: string): CategoryKey | undefined {
  return CATEGORY_ORDER.find((k) => k === slug);
}

const RULES: Array<{ key: CategoryKey; test: RegExp }> = [
  { key: "fees", test: /(fee|charge|admin|monthly account|cash deposit fee|sms notif|card levy)/i },
  { key: "atm", test: /(atm|cash withdrawal|cash @|cashback|cash back|till withdrawal)/i },
  { key: "debit-orders", test: /(debit order|d\/?o |premium|insurance|policy|medical aid|funeral|dstv|gym|contract|loan repay|stop order)/i },
  { key: "online", test: /(online|internet pmt|app payment|takealot|netflix|spotify|airtime top|uber|e-?commerce|website)/i },
  { key: "transfers", test: /(transfer|eft to|payment to|sent to|instant money|immediate pmt)/i },
  { key: "income", test: /(sassa|grant|pension|salary|deposit|credit interest|refund|received from|eft from)/i },
  { key: "purchases", test: /(checkers|woolworths|pick n pay|shoprite|spar|clicks|dis-chem|engen|shell|sasol|pharmacy|purchase|pos |card purchase|bp )/i },
];

export function categorise(description: string, amount: number): CategoryKey {
  if (amount > 0) {
    if (/(refund|reversal)/i.test(description)) return "income";
    for (const rule of RULES) {
      if (rule.key === "income" && rule.test.test(description)) return "income";
    }
    return "income";
  }
  for (const rule of RULES) {
    if (rule.key === "income") continue;
    if (rule.test.test(description)) return rule.key;
  }
  return "other";
}
