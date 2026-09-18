import { categorise } from "./categories";
import type { Statement, Transaction } from "./types";

type RawTxn = [date: string, description: string, amount: number, time?: string];

function build(
  id: string,
  bank: string,
  accountMasked: string,
  holder: string,
  periodStart: string,
  periodEnd: string,
  rows: RawTxn[],
): Statement {
  const transactions: Transaction[] = rows.map(([date, description, amount, time], i) => ({
    id: `${id}-t${i + 1}`,
    statementId: id,
    date,
    time,
    description,
    amount,
    category: categorise(description, amount),
  }));
  return {
    id,
    bank,
    accountMasked,
    holder,
    periodStart,
    periodEnd,
    source: "demo",
    addedAt: `${periodEnd}T09:00:00.000Z`,
    transactions,
  };
}

export const DEMO_STATEMENTS: Statement[] = [
  build(
    "demo-capitec",
    "Capitec Bank",
    "**** **** 4821",
    "M. Ndlovu",
    "2026-08-01",
    "2026-08-31",
    [
      ["2026-08-03", "SASSA Older Persons Grant", 2180, "06:12"],
      ["2026-08-03", "Cash Withdrawal ATM Shoprite Soweto", -600, "09:40"],
      ["2026-08-04", "Card Purchase Checkers Maponya Mall", -742.35, "11:05"],
      ["2026-08-05", "Debit Order Hollard Funeral Policy", -210, "05:00"],
      ["2026-08-06", "Debit Order Vodacom Contract", -199, "05:02"],
      ["2026-08-07", "Monthly Account Admin Fee", -55, "23:00"],
      ["2026-08-09", "Card Purchase Clicks Pharmacy Jabulani", -318.9, "14:22"],
      ["2026-08-12", "Card Purchase Pick n Pay Protea Glen", -489.6, "10:11"],
      ["2026-08-12", "Card Purchase Pick n Pay Protea Glen", -489.6, "10:19"],
      ["2026-08-15", "Transfer to S. Ndlovu", -500, "16:30"],
      ["2026-08-18", "Cash Withdrawal ATM Capitec Dobsonville", -800, "08:15"],
      ["2026-08-20", "Airtime Top Up Online Vodacom", -60, "19:02"],
      ["2026-08-22", "Card Purchase Woolworths Food Southgate", -612.75, "13:48"],
      ["2026-08-25", "Debit Order Bonitas Medical Aid", -1480, "05:01"],
      ["2026-08-26", "Received from T. Mokoena", 350, "12:00"],
      ["2026-08-28", "SMS Notification Fee", -18, "23:00"],
      ["2026-08-29", "Card Purchase Engen Garage Lenasia", -400, "07:35"],
    ],
  ),
  build(
    "demo-fnb",
    "FNB",
    "**** **** 7309",
    "M. Ndlovu",
    "2026-07-01",
    "2026-07-31",
    [
      ["2026-07-01", "Pension Payment GEPF", 6450, "04:30"],
      ["2026-07-02", "Debit Order Old Mutual Premium", -640, "05:00"],
      ["2026-07-02", "Debit Order Old Mutual Premium", -640, "05:06"],
      ["2026-07-03", "Card Purchase Spar Randburg", -388.4, "10:02"],
      ["2026-07-05", "ATM Cash Withdrawal FNB Cresta", -1500, "09:20"],
      ["2026-07-06", "Monthly Account Fee", -110, "23:00"],
      ["2026-07-08", "Online Payment Takealot Order", -899, "20:14"],
      ["2026-07-10", "Card Purchase Dis-Chem Northgate", -524.15, "15:00"],
      ["2026-07-13", "Debit Order MTN Data Contract", -149, "05:03"],
      ["2026-07-15", "EFT to P. Dlamini", -1200, "17:45"],
      ["2026-07-18", "Card Purchase Woolworths Cresta", -730.8, "12:10"],
      ["2026-07-21", "Debit Order DSTV Compact", -459, "05:05"],
      ["2026-07-24", "Card Purchase Checkers Hyper Northgate", -1105.6, "11:40"],
      ["2026-07-26", "Cash Withdrawal Till Pick n Pay", -300, "16:25"],
      ["2026-07-28", "Card Levy Fee", -25, "23:00"],
      ["2026-07-30", "Refund Takealot Order", 899, "10:00"],
    ],
  ),
  build(
    "demo-standard",
    "Standard Bank",
    "**** **** 1164",
    "M. Ndlovu",
    "2026-06-01",
    "2026-06-30",
    [
      ["2026-06-02", "SASSA Older Persons Grant", 2180, "06:05"],
      ["2026-06-02", "Card Purchase Shoprite Rosebank", -655.2, "10:30"],
      ["2026-06-04", "Debit Order Sanlam Life Cover", -520, "05:00"],
      ["2026-06-05", "ATM Withdrawal Standard Bank Killarney", -1000, "08:50"],
      ["2026-06-09", "Card Purchase Pick n Pay Norwood", -412.9, "13:15"],
      ["2026-06-11", "Online Payment Netflix SA", -199, "21:30"],
      ["2026-06-12", "Monthly Service Fee", -99, "23:00"],
      ["2026-06-14", "Transfer to Grandchild School Fees", -850, "09:00"],
      ["2026-06-16", "Card Purchase Sasol Garage Houghton", -520, "07:20"],
      ["2026-06-18", "Debit Order Vodacom Contract", -199, "05:02"],
      ["2026-06-19", "Card Purchase Woolworths Killarney", -806.45, "14:05"],
      ["2026-06-21", "Cash Withdrawal ATM Killarney Mall", -700, "11:11"],
      ["2026-06-24", "Cash Withdrawal ATM Killarney Mall", -700, "11:26"],
      ["2026-06-27", "Debit Order Discovery Health", -1620, "05:01"],
      ["2026-06-28", "Received from L. Khumalo", 600, "18:40"],
    ],
  ),
  build(
    "demo-nedbank",
    "Nedbank",
    "**** **** 9052",
    "M. Ndlovu",
    "2026-05-01",
    "2026-05-31",
    [
      ["2026-05-03", "Pension Payment GEPF", 6450, "04:30"],
      ["2026-05-04", "Card Purchase Checkers Centurion", -978.3, "10:45"],
      ["2026-05-06", "Debit Order AVBOB Funeral Plan", -305, "05:00"],
      ["2026-05-07", "ATM Cash Withdrawal Nedbank Centurion", -1200, "09:05"],
      ["2026-05-09", "Online Payment Uber Trip", -145.5, "16:10"],
      ["2026-05-10", "Monthly Account Fee", -125, "23:00"],
      ["2026-05-12", "Card Purchase Clicks Centurion Mall", -289.99, "12:35"],
      ["2026-05-14", "Card Purchase Clicks Centurion Mall", -289.99, "12:52"],
      ["2026-05-16", "EFT to Municipality Rates", -1340, "08:30"],
      ["2026-05-19", "Debit Order MTN Airtime Contract", -179, "05:04"],
      ["2026-05-22", "Card Purchase Spar Lyttelton", -467.2, "15:20"],
      ["2026-05-25", "Cash Withdrawal ATM Lyttelton", -500, "10:00"],
      ["2026-05-27", "Debit Order Momentum Health", -1750, "05:01"],
      ["2026-05-29", "Credit Interest", 12.44, "23:59"],
    ],
  ),
];

const UPLOAD_ROWS: RawTxn[] = [
  ["2026-09-02", "SASSA Older Persons Grant", 2180, "06:10"],
  ["2026-09-02", "Card Purchase Checkers Bree Street", -689.4, "11:20"],
  ["2026-09-04", "Debit Order Vodacom Contract", -199, "05:02"],
  ["2026-09-05", "ATM Cash Withdrawal Bree Taxi Rank", -900, "08:40"],
  ["2026-09-06", "Monthly Account Admin Fee", -60, "23:00"],
  ["2026-09-08", "Card Purchase Pick n Pay Braamfontein", -534.25, "13:05"],
  ["2026-09-08", "Card Purchase Pick n Pay Braamfontein", -534.25, "13:21"],
  ["2026-09-11", "Online Payment Airtime MTN", -100, "19:45"],
  ["2026-09-13", "Transfer to N. Sithole", -450, "17:00"],
  ["2026-09-15", "Card Purchase Woolworths Rosebank", -712.6, "12:15"],
  ["2026-09-18", "Debit Order Hollard Funeral Policy", -210, "05:00"],
  ["2026-09-20", "Debit Order Bonitas Medical Aid", -1480, "05:01"],
  ["2026-09-22", "Cash Withdrawal ATM Rosebank", -700, "09:30"],
  ["2026-09-24", "SMS Notification Fee", -18, "23:00"],
  ["2026-09-26", "Received from T. Mokoena", 500, "14:00"],
];

/** Prototype "reader": produces a realistic statement for any uploaded file. */
export function parseUploadedStatement(fileName: string): Statement {
  const id = `upload-${Date.now()}`;
  const statement = build(
    id,
    "Capitec Bank",
    "**** **** 4821",
    "M. Ndlovu",
    "2026-09-01",
    "2026-09-30",
    UPLOAD_ROWS,
  );
  return { ...statement, source: "upload", fileName, addedAt: new Date().toISOString() };
}
