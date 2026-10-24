# Expense Tracker

A small personal expense tracker for a college mini project. It runs in the browser, saves records in `localStorage`, and can be hosted as a static site on Vercel.

## Overview

The app has three screens:

- **Dashboard** shows total income, total expenses, net balance, the latest transactions, and spending by category.
- **Transactions** adds, edits, deletes, searches, and filters records.
- **About** explains how the numbers work, where data is stored, and how to restore the demo list.

There is no account, no server, and no bank connection. The people using this browser profile can see the saved records.

## Abstract

Students and other individuals often lose track of small daily expenses because the amounts are written in notes, chats, or memory. This project is a simple web notebook for income and expenses. The user adds a title, a positive amount, a type (income or expense), a category, a date, and an optional note. The dashboard calculates totals from that list. Records stay in the browser, so the project can be built and deployed without a database.

## Real-world problem

A student may receive a stipend, pay rent, and spend on food and travel in the same month. Those amounts are easy to forget when they live in different places. A short list with a running balance makes it easier to see whether income still covers spending. This app is a learning version of that notebook. It is not a replacement for a bank statement.

## Objectives

- Record income and expenses with validation.
- Calculate total income, total expenses, and net balance from the same list.
- Show recent transactions and expense totals by category.
- Search and filter the list without changing the dashboard totals.
- Keep the data after a refresh by using `localStorage`.
- Present the screens clearly on a laptop and on a phone.
- Deploy the built site on Vercel without environment variables.

## Features

Implemented in this project:

- Summary cards for total income, total expenses, and net balance.
- Add, edit, and delete transactions. Delete asks for confirmation.
- Search by title or note.
- Filter by type, category, and month.
- A separate “matching records” summary for the filtered list.
- Recent transactions (up to five) and a CSS bar summary of expenses by category.
- Demo records on the first visit only, when no saved list exists yet.
- Reset demo data, with a confirmation dialog.
- Success and error messages, field errors, and empty states.
- Rupee formatting with `en-IN` (`₹` and Indian digit grouping).
- A short About page that explains storage and the formulas.

Not implemented (possible later work):

- Login, cloud sync, or sharing between devices.
- Bank or UPI connections.
- Budgets, receipts, charts from a chart library, CSV export, or multiple currencies.

## Scope

This is a mini project. It stores one list of transactions in one browser profile. It does not try to be a full finance product.

## Tech stack and why it was chosen

| Tool | Role | Why it is here |
| --- | --- | --- |
| React 19 | Interface | The screen is split into small components. When the list changes, React renders it again. |
| Vite 8 | Dev server and build | `npm run dev` starts quickly. `npm run build` writes a static `dist` folder. |
| TypeScript 6 | Types | A transaction has a known shape, so missing fields are caught before the app runs. |
| Tailwind CSS 4 | Styling | Utility classes keep spacing, color, and layout consistent. The theme lives in `src/index.css`. |
| Lucide React | Icons | Simple icons for navigation, income, expense, edit, and delete. |
| Browser `localStorage` | Persistence | No database or account is required. |
| Vitest | Tests | Checks the formulas, validation, storage rules, and main screen actions. |
| Oxlint | Lint | Included by the Vite template. `npm run lint` runs it. |

Tailwind v4 is connected with `@tailwindcss/vite`. There is no `tailwind.config.js`. Colors and the font are set with `@theme` in `src/index.css`.

The app does not use React Router. Dashboard, Transactions, and About are switched in React state, so the address bar stays on one page. Because of that, `vercel.json` is not required.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (this copy was checked with Node `v24.21.0` and npm `11.4.2`)
- npm
- A current browser (Chrome, Edge, or Firefox)

No API key or `.env` file is required.

## Installation

From the project folder (the folder that contains `package.json`):

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`. Open that address.

Other commands:

```bash
npm test
npm run lint
npm run build
npm run preview
```

`npm run build` type-checks with `tsc -b` and writes the site to `dist`. `npm run preview` serves that folder.

## Folder structure

```text
expense-tracker/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  .oxlintrc.json
  public/favicon.svg
  src/
    main.tsx                 Starts React
    App.tsx                  Screens, form, and delete dialog
    App.test.tsx             Screen workflow tests
    index.css                Tailwind theme
    ui.ts                    Shared button and input classes
    types/transaction.ts     Transaction, draft, and filter types
    data/categories.ts       Fixed income and expense categories
    data/demoTransactions.ts Demo list created on first launch
    services/storage.ts      Read and write localStorage
    hooks/useTransactions.ts Add, edit, delete, reset, and banners
    utils/calculations.ts    Income, expenses, balance, category totals
    utils/validation.ts      Form rules
    utils/filters.ts         Search, type, category, and month
    utils/money.ts           Rupee formatting and paise sums
    utils/dates.ts           Calendar dates
    utils/id.ts              Unique ids
    components/              Layout, cards, list, form, dialogs
    views/                   Dashboard, Transactions, and About
```

Test files sit next to the code they check. `src/test/setup.ts` prepares the test page.

## Data model

Each transaction is one object:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable id. Editing does not change it. |
| `title` | string | Required, 1–60 characters after trimming. |
| `amount` | number | Positive rupees, up to 2 decimal places. |
| `type` | `"income"` or `"expense"` | Which way the money moved. |
| `category` | string | One of the fixed categories for that type. |
| `date` | string | `YYYY-MM-DD`, from year 2000 through 2100. |
| `note` | string | Optional, up to 200 characters. |
| `createdAt` | string | ISO time used as a tie-breaker when dates match. |

Income categories: Salary, Freelance, Gift, Other.

Expense categories: Food, Transport, Rent, Utilities, Shopping, Health, Education, Entertainment, Other.

The saved value is a JSON array under the key `expense-tracker.transactions.v1`.

## Calculations

Amounts are stored as positive numbers. The type decides the meaning.

- Total income = sum of amounts where `type` is `income`.
- Total expenses = sum of amounts where `type` is `expense`.
- Net balance = total income − total expenses.
- Category bars add expenses only. Income is left out.
- The dashboard always uses the full saved list.
- The Transactions page also shows income, expenses, and net for the rows that match the current search and filters.

Sums are done in paise (the rupee amount × 100, rounded) and then converted back to rupees. That avoids small binary floating-point drift such as `0.1 + 0.2`.

A positive balance is labelled **Surplus**. A negative balance is labelled **Deficit**. Zero is labelled **Even**. Income rows also show the word “Income” and an upward icon. Expense rows show “Expense” and a downward icon.

Displayed money uses:

```ts
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
```

## LocalStorage

`src/services/storage.ts` reads and writes the list.

- If the key is missing, the app creates the demo list and saves it.
- If the key exists and the value is `[]`, the list stays empty. Demo data is not written again.
- If the JSON cannot be parsed, or the value is not an array, the app shows a warning and does not overwrite the stored text.
- Incomplete records inside an array are skipped. They remain in storage until the user saves a later change.
- If the browser blocks storage, the app shows an error and does not crash.

Refresh the page and the last successful save is shown again. Clearing site data, using a private window, or opening another browser removes or hides that list. Vercel hosting does not copy these records between users or devices.

The demo dates are created from the day of the first save. One sample expense, “Movie night”, is dated the 15th of the previous month so the month filter has something to compare. The demo amounts are:

| Record | Type | Amount (₹) |
| --- | --- | --- |
| Monthly salary | Income | 42,000 |
| Weekend freelance | Income | 6,500 |
| Room rent | Expense | 10,000 |
| Groceries | Expense | 1,860 |
| Metro pass | Expense | 450 |
| Electricity bill | Expense | 1,240 |
| Dinner with friends | Expense | 780 |
| Movie night | Expense | 620 |

From those amounts: income `48,500`, expenses `14,950`, net `33,550`. Food expenses are `2,640`.

## Limitations

- Data belongs to this browser profile on this device.
- There is no login and no encryption.
- Anyone who can open this browser profile can read the list.
- Clearing site data deletes the list, and the app cannot recover it.
- The category list is fixed.
- The month control uses `<input type="month">`. Very old browsers may not show a month picker.
- The font Manrope is requested from Google Fonts. If that request fails, the page uses Segoe UI or another system font. Transaction data does not depend on that request.
- Layout was implemented with responsive classes. A graphical phone and desktop pass was not completed in the session that built this copy. Check those widths before a demo.

## Test checklist

Automated checks below were run in this workspace on 24 October 2026.

| Check | Command | Result |
| --- | --- | --- |
| Unit and screen tests | `npm test` | Passed. Vitest 5.0.5, 5 files, 38 tests. |
| Lint | `npm run lint` | Passed. Oxlint reported no warnings. |
| Typecheck and production build | `npm run build` | Passed. Output written to `dist`. |
| Preview the build | `npm run preview` | The local preview returned HTTP 200 for `index.html`, the built JavaScript, and the built CSS. |

The 38 tests cover:

- Income, expense, net balance, empty lists, deficit labels, and paise addition.
- Category totals ignoring income.
- Sort order.
- The demo amounts above.
- Rupee formatting includes `₹` and Indian grouping for `48500`.
- Validation of empty fields, zero, negative, text, extra decimals, commas, huge amounts, wrong categories, bad dates, and long text.
- Search, type, category, and month filters.
- Seeding only when the key is missing, keeping `[]`, and leaving broken JSON untouched.
- Add, edit, delete (including Cancel), search, reset, and reload in the rendered app.
- Dashboard totals staying on the full list after a search.

These tests use Vitest and jsdom. They click and read text. They do not measure a real phone or desktop layout.

Before submission, repeat this in a browser:

- [ ] Open the dashboard and confirm the three cards, the recent list, and the category bars.
- [ ] Narrow the window and confirm the cards stack and the top navigation replaces the sidebar.
- [ ] Add a valid expense and confirm the expense total and category bar change.
- [ ] Try a blank title, `0`, and `abc` as the amount. The form should stay open and show errors.
- [ ] Edit a record and refresh. The edit should remain.
- [ ] Delete, choose Cancel, then delete again and confirm.
- [ ] Search a note such as `milk`. Then return to the dashboard and confirm the cards still use every record.
- [ ] Filter by the previous month and find “Movie night”.
- [ ] Reset demo data from About, including Cancel and confirm.
- [ ] Tab through the form and close a dialog with Escape.

## Troubleshooting

| What you see | What to try |
| --- | --- |
| `npm` is not recognized | Install Node.js, then open a new terminal. |
| The page is blank | Confirm the terminal is in this folder and `npm run dev` is running. Open the URL Vite prints. |
| Styles look unstyled | Confirm `src/index.css` starts with `@import "tailwindcss"` and `vite.config.ts` includes the Tailwind plugin. |
| Demo data did not appear | The browser already has a saved list, including an empty one. Use **Reset demo data** on the About page, or remove the key `expense-tracker.transactions.v1` in the browser’s site data. |
| Records disappeared | The site was opened in another browser, a private window, or after site data was cleared. |
| Port 5173 is busy | Vite chooses another port and prints it. |
| Build fails on Node | Use Node `20.19+` or `22.12+`. |

## Deploy on Vercel

Vercel serves the built files. It does not receive the transaction list. Each visitor’s records stay in that visitor’s browser.

This project does not need `vercel.json`. There is only one URL. The sidebar and mobile nav do not change the path.

1. Install [Git](https://git-scm.com/) and create a GitHub account.
2. Make this folder its own Git repository so `package.json` is at the repository root. If this folder currently sits inside another Git repository, such as a home directory, create a separate repository for `expense-tracker` rather than pushing the parent folder.
3. Confirm `.gitignore` excludes `node_modules` and `dist`.
4. Commit the source, `package.json`, and `package-lock.json`.
5. Create an empty GitHub repository and push this project.

```bash
git init
git add .
git commit -m "Add the expense tracker mini project"
git branch -M main
git remote add origin https://github.com/YOUR_USER/expense-tracker.git
git push -u origin main
```

6. Sign in at [https://vercel.com](https://vercel.com) and choose **Add New Project**.
7. Import the GitHub repository.
8. Use these settings if they are not filled in automatically:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
   - Environment variables: leave this empty
9. Deploy.
10. Open the `https://….vercel.app` URL.
11. Add a transaction, refresh, and confirm it is still there.
12. Open the same URL in a private window. The private window starts from its own empty storage and will create its own demo list. That shows the records are not shared through Vercel.

Later pushes to the connected branch can redeploy the site. A redeploy updates the app files. It does not merge or restore anyone’s `localStorage`.

## Conclusion

The tracker gives a beginner a complete, small finance notebook: validated records, totals derived from that list, browser persistence, and a static build that Vercel can host. The About page and this file both state the storage limit so the project is not presented as a bank-connected product.

## Viva preparation

Read `VIVA_QUESTIONS.md` and be ready to open `src/services/storage.ts`, `src/utils/calculations.ts`, and `src/utils/validation.ts` while you explain them. Replace the name, college, and guide placeholders in `PROJECT_REPORT.md` before you submit it.
