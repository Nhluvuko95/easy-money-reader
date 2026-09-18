# Old Age Bank Statement Analysis

A mobile-first web app for people aged 55+ that turns a bank statement into a simple, grouped money summary in South African Rand.

## What the app will do

**Home** — Warm welcome, big "Upload a statement" button, a plain-language note that the app only reads and never touches money, and a shortcut to try the built-in demo statements.

**Upload** — Choose a PDF or photo, or take a photo with the phone camera. A friendly "Reading your statement..." screen with clear progress, then straight to the results. For the prototype the reading step uses realistic demo South African statement data.

**Dashboard** — Large cards: Total Money In, Total Money Out, biggest spending groups, a red alert card showing how many possible duplicates were found, and the most recent transactions.

**Categories** — Money grouped into Debit Orders, Withdrawals/ATM, Purchases, Online, Transfers, Bank Fees, Income and Other, listed from highest spending to lowest with a simple bar showing each share. Tapping a group opens its full transaction list.

**Duplicates** — Every transaction that looks charged twice, shown side by side with the date, shop and amount, marked "Possible Duplicate", with a "Looks fine" / "Keep flagged" choice.

**Summary** — Month-by-month view: in, out, what's left, and the top three spending groups.

**Statements** — List of uploaded statements with masked account numbers (e.g. **** **** 4821), bank name, period, and a delete button with confirmation.

Bottom navigation with four large tabs: Home, Statements, Duplicates, Summary.

## Demo data

Four fictional statements (Capitec, FNB, Standard Bank, Nedbank) with realistic South African activity: Checkers, Woolworths, Pick n Pay, SASSA grant deposits, Vodacom and MTN debit orders, medical aid and funeral policy debit orders, ATM withdrawals, card purchases, EFT transfers and bank charges — including a few deliberate near-duplicates so the duplicate feature has something to show.

## Design

Warm, calm and high-contrast: deep navy text on a soft cream background, a strong green for money in, a clear amber/red for money out and warnings. Base text around 20px, headings much larger, buttons at least 60px tall with icons plus words. Generous spacing, one main action per screen, no jargon.

## Technical notes

- Frontend only, no backend needed: statements and duplicate decisions are kept in the browser's local storage, so nothing leaves the device.
- Design tokens (colours, radii, senior-scale typography) defined in `src/styles.css`; no hardcoded colour classes.
- Routes: `/`, `/upload`, `/processing`, `/dashboard`, `/categories`, `/categories/$category`, `/duplicates`, `/summary`, `/statements`, each with its own page metadata.
- Shared logic in `src/lib/`: demo statement dataset, categorisation rules, duplicate matching (same/near amount within a few days and similar description), and currency formatting in ZAR.
- Uploaded files are accepted and acknowledged, but parsing is simulated with the demo dataset for this prototype — real PDF/OCR extraction would be a later step.
