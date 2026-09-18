# Senior Statement Buddy

Build a mobile-first web app called "Old Age Bank Statement Analysis" tailored specifically for users aged 55+.

Key requirements:
1. Accessibility & Senior-Friendly UI:
   - Extra-large readable fonts, high contrast, generous touch targets and large buttons.
   - Clean, uncluttered layout with clear icons, simple language, and warm, reassuring guidance.
   - Mobile-first responsive design.

2. Currency & Demo Data:
   - South African Rand (ZAR / R).
   - Provide realistic preloaded South African demo statements (e.g., Capitec, FNB, Standard Bank, Nedbank statements featuring Checkers, Woolworths, Pick n Pay, SASSA grants, debit orders, Vodacom/MTN, ATM withdrawals, and bank charges) so users can test immediately.

3. Core Features:
   - Statement Upload & Analysis: Upload PDF/images or use device camera, with sample data parser extracting date, description, and amount.
   - Transaction Grouping: Auto-categorize into Debit Orders, Withdrawals/ATM, Purchases, Online Transactions, Transfers, Bank Fees, Income, and Other. Sort categories from highest spending to lowest.
   - Duplicate Detection: Identify potential duplicates (matching/near-matching amount, date, description) flagged with clear "Possible Duplicate" badges, with a dedicated review view.
   - Simple Money Dashboard: Big visual cards for Total Money In, Total Money Out, top spending categories, duplicate count alert, and recent activity.
   - Navigation: Bottom bar / tab navigation with Home, Statements, Duplicates, and Summary.
   - Safety & Privacy: Clear disclaimer that this is a read-only analysis tool with no payment or bank credential access; mask sensitive account details, and allow users to delete uploaded statements.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://easy-money-reader.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/10255e92-8291-4bfa-907f-b3ab5952e50c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
