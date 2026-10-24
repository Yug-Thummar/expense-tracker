# Project Report

## Expense Tracker

A browser-based personal income and expense notebook

---

**Student name:** [Your Name]

**Roll number:** [Your Roll Number]

**Class / semester:** [Your Class / Semester]

**Department:** [Department Name]

**College:** [College Name]

**Guide:** [Guide Name]

**Academic year:** [Academic Year]

**Subject:** [Subject Name]

---

## Certificate

This is to certify that **[Your Name]**, roll number **[Your Roll Number]**, of **[Department Name]**, **[College Name]**, has completed the mini project titled **Expense Tracker** during **[Academic Year]** under the guidance of **[Guide Name]**.

The report and the program submitted with it are the student’s work for academic evaluation.

**Guide:** [Guide Name]

**Head of department:** [Head of Department]

**Date:** [Date]

**Place:** [Place]

---

## Acknowledgement

I thank **[Guide Name]** for guiding this mini project and **[College Name]** for the chance to build it. I also thank my classmates who tried the screens and pointed out unclear labels.

The interface uses React, Vite, TypeScript, Tailwind CSS, and Lucide, which are open-source projects. Browser storage follows the Web Storage API documented by MDN.

**[Your Name]**

**[Roll Number]**

---

## Abstract

Expense Tracker is a small web application for recording personal income and expenses. The user enters a title, a positive amount, a type, a category, a date, and an optional note. The dashboard adds income, adds expenses, and subtracts expenses from income to show the net balance. A category summary adds expenses only. All of these figures are calculated from the transaction list whenever the screen renders, so the cards cannot drift away from the rows.

The list is stored in the browser with `localStorage`. There is no server database and no login. The first visit in a browser creates a short demo list. Later visits keep the user’s saved list, including a list the user has emptied. The project builds to a static `dist` folder and can be hosted on Vercel. Hosting publishes the website. It does not upload the user’s transactions.

## 1. Introduction

Keeping a short money notebook is a common need for students. A stipend, a freelance payment, rent, food, and travel can all happen in one month. If those amounts stay in memory, the person cannot see what is left.

Spreadsheets can store the same numbers, but a first web project is a good place to practice forms, validation, calculated summaries, and responsive layout. This mini project does that with a deliberately small scope: three screens and one list of transactions.

## 2. Problem statement

People need a simple way to record money in and money out, see the balance, and find a past item. A college project also needs to stay understandable in a viva: the data should have one clear shape, the totals should have one formula, and the saved data should survive a refresh without introducing a backend the student cannot explain.

The problem addressed here is: build a small, working expense notebook that validates input, calculates totals from the saved rows, stores those rows in the browser, and can be deployed as a static site.

## 3. Objectives

1. Let the user add, edit, and delete transactions.
2. Require a title, a positive amount, a known type, a known category, and a valid date.
3. Calculate total income, total expenses, and net balance from the transaction list.
4. Show recent rows and expense totals by category.
5. Search by title or note, and filter by type, category, and month.
6. Keep filters from changing the dashboard totals.
7. Save the list in `localStorage` and restore it on refresh.
8. Load demo data only when the browser has no saved key.
9. Ask before delete and before replacing the list with demo data.
10. Format money as Indian rupees.
11. Keep the layout usable on a narrow screen and on a laptop.
12. Produce a Vite build that Vercel can host without environment variables.

## 4. Existing system and proposed system

| Point | Everyday existing approach | This project |
| --- | --- | --- |
| Where amounts live | Notes, chats, or a spreadsheet | One transaction list in the browser |
| Totals | Calculated by hand, or by spreadsheet formulas the user must maintain | Calculated in code from the current list |
| Checking input | Easy to leave blank or to type a negative amount | The form blocks invalid values and explains the error |
| Finding an item | Scrolling through notes | Search and filters |
| Phone use | A spreadsheet can be awkward on a small screen | Cards stack, and a compact nav replaces the sidebar |
| Accounts | A cloud sheet may need a login | No login. Data stays in this browser profile |

The proposed system is intentionally smaller than a banking app. That limit is part of the design.

## 5. Scope

### Included

- Dashboard, Transactions, and About.
- Create, read, update, and delete for one transaction list.
- Confirmation before a destructive action.
- Demo data, and a confirmed reset.
- Responsive layout classes, labels, and keyboard focus.
- Static hosting instructions for Vercel.

### Excluded

- Servers, databases, authentication, and bank APIs.
- Budgets, bill reminders, file upload, CSV export, and a chart library.
- Multiple users, multiple currencies, and sync between phones.

## 6. Requirements

### Functional requirements

| ID | Requirement |
| --- | --- |
| FR1 | Show total income, total expenses, and net balance. |
| FR2 | Add a transaction with title, amount, type, category, date, and optional note. |
| FR3 | Edit and delete a transaction. Delete requires confirmation. |
| FR4 | Search title and note. Filter by type, category, and month. |
| FR5 | Show up to five recent transactions and expense totals by category. |
| FR6 | Create demo data on the first visit only. |
| FR7 | Reset demo data only after confirmation. |
| FR8 | Show success, error, and empty states. |
| FR9 | Format amounts in INR. |

### Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR1 | The interface should be readable on a phone width and on a laptop. |
| NFR2 | Inputs need labels, buttons need names, and keyboard focus should be visible. |
| NFR3 | Broken stored JSON must not crash the page. |
| NFR4 | The code should stay in small files a beginner can open during a viva. |
| NFR5 | The production build must not require secret environment variables. |

## 7. Architecture

The browser downloads the static HTML, CSS, and JavaScript. React then renders the current view. There is no application server.

```text
Browser
  |
  |-- index.html, CSS, JavaScript  (hosted files, for example on Vercel)
  |
  +-- React app
        |-- App.tsx
        |     switches Dashboard, Transactions, and About
        |-- useTransactions
        |     add, update, delete, reset
        |-- calculations.ts
        |     income, expenses, balance, categories
        |-- validation.ts
        |     form rules
        |-- storage.ts
              getItem / setItem
              |
              +-- localStorage key expense-tracker.transactions.v1
```

Vercel, or any static host, replaces only the top box: the files. The `localStorage` box stays on the user’s computer.

View changes do not change the URL. A rewrite file is therefore not part of this project.

## 8. Technology stack

| Layer | Choice |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4, through `@tailwindcss/vite` |
| Icons | Lucide React |
| Storage | Web Storage API (`localStorage`) |
| Tests | Vitest 5, Testing Library, jsdom |
| Lint | Oxlint, from the Vite template |
| Hosting target | Vercel static hosting |
| Package manager | npm |

The theme colors are CSS variables in `src/index.css`: a warm off-white page (`#f4f1ea`), white cards, navy text (`#172033`), and a teal accent (`#0c5f5a`). Expense amounts use a dark clay color and the word “Expense”, so the difference is not carried by color alone.

## 9. Data model

A transaction stored in the array:

```ts
type Transaction = {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  note: string
  createdAt: string
}
```

`amount` is always a positive number in the saved list. The form starts with text, because a text field can contain `abc` or `-5`. `validateTransaction` either returns a number or an error. Invalid text is never stored.

Ids come from `crypto.randomUUID()` when the browser provides it. Otherwise `createId` builds an id from the current time and a random suffix. An edit keeps the same `id` and `createdAt`.

### Demo records

The demo list is created when it is saved, so the dates move with the calendar. Amounts are fixed:

| Title | Type | Category | Amount (₹) | When |
| --- | --- | --- | --- | --- |
| Monthly salary | Income | Salary | 42000 | The day it is seeded |
| Weekend freelance | Income | Freelance | 6500 | 1 day earlier |
| Room rent | Expense | Rent | 10000 | 2 days earlier |
| Groceries | Expense | Food | 1860 | 3 days earlier |
| Metro pass | Expense | Transport | 450 | 4 days earlier |
| Electricity bill | Expense | Utilities | 1240 | 5 days earlier |
| Dinner with friends | Expense | Food | 780 | 6 days earlier |
| Movie night | Expense | Entertainment | 620 | Day 15 of the previous month |

Expected totals from those amounts: income 48500, expenses 14950, net 33550. Food is 2640.

## 10. Modules

| Module | Responsibility |
| --- | --- |
| `App.tsx` | Holds the open screen, the form dialog, and the delete dialog |
| `AppShell.tsx` | Sidebar on large screens, compact nav on small screens |
| `DashboardView.tsx` | Cards, recent rows, category summary |
| `TransactionsView.tsx` | Filters, matching totals, full list |
| `AboutView.tsx` | Explanation and demo reset |
| `TransactionFormDialog.tsx` | Add and edit form |
| `ConfirmDialog.tsx` | Confirm delete and reset |
| `useTransactions.ts` | Save after each successful change and show a banner |
| `storage.ts` | Load and save rules |
| `calculations.ts` | Formulas |
| `validation.ts` | Field errors |
| `filters.ts` | Search and filters |
| `money.ts` | `formatINR` and paise addition |

## 11. Algorithms and workflows

### Load

1. Read `expense-tracker.transactions.v1`.
2. If the key is missing, build the demo list, try to save it, and show it.
3. If the value is an array, keep records that have a unique id, a title, a positive finite amount, a known type, a known category, a real date, a note within 200 characters, and a parseable `createdAt`.
4. If some records are invalid, show how many were skipped and leave the stored text unchanged until the next successful save.
5. If parsing fails, or the value is not an array, show a warning and leave the stored text unchanged.
6. If `getItem` throws, show that storage is blocked.

### Add

1. Validate the form.
2. If it is invalid, show the field errors and leave the dialog open.
3. If it is valid, create an id and `createdAt`.
4. Put the new row on the list and `JSON.stringify` the whole list.
5. If `setItem` throws, keep the previous list and show an error.
6. If it succeeds, close the dialog and show “Transaction added.”

### Edit

1. Validate the form.
2. Replace the row with the same id. Keep `id` and `createdAt`.
3. Save the full list, as in add.
4. Show “Transaction updated.”

### Delete

1. The user chooses Delete.
2. A dialog asks for confirmation. Escape or Cancel closes it and keeps the row.
3. Confirm removes that id and saves the remaining list.

### Reset demo data

1. The About page asks for confirmation.
2. Confirm replaces the list with a newly created demo set and saves it.

### Filter

A row is shown when all of these are true:

- The type matches, or the type filter is “all”.
- The category matches, or the category filter is “all”.
- The date starts with the chosen `YYYY-MM`, or the month is blank.
- The query is empty, or the lowercase title plus note contains the lowercase query.

The dashboard calls `getSummary` with the full array. The Transactions page calls it again with the filtered array and labels those numbers “Matching”.

### Totals

```text
totalIncome   = sum of amounts where type is income
totalExpenses = sum of amounts where type is expense
netBalance    = totalIncome - totalExpenses
```

Each sum converts rupees to paise with `Math.round(amount * 100)`, adds those integers, and divides by 100.

Category totals use the same paise addition and ignore income. Bars are scaled against the largest category. The percentage is that category’s share of all expenses.

## 12. Implementation details

- React state holds the list. There is no extra totals state that could become stale.
- `localStorage` is synchronous, so the list is read while state is created. The first render already has the saved rows.
- Success banners clear after 4 seconds. Error banners stay until they are dismissed.
- Dialogs close on Escape, return focus to the previously focused control, and keep Tab inside the dialog.
- The delete confirmation focuses Cancel first.
- Money on screen goes through `formatINR`.
- The sidebar is hidden below the `lg` breakpoint (1024px). A three-button bar is shown instead. Summary cards are one column below the `md` breakpoint (768px) and three columns from there upward.
- Transaction rows stack on narrow screens and use `break-words` so a long title does not force horizontal scrolling.
- `color-scheme: light` keeps date and month controls readable on the light background.
- Focus uses a teal `:focus-visible` outline.

## 13. Testing

### Automated checks run on 24 October 2026

Environment: Node `v24.21.0`, npm `11.4.2`, Windows.

| Command | Observed result |
| --- | --- |
| `npm test` | Passed. Vitest 5.0.5. 5 files, 38 tests. |
| `npm run lint` | Passed. Oxlint printed no warnings. |
| `npm run build` | Passed. `tsc -b` and Vite wrote `dist`. |
| Preview at `http://127.0.0.1:4173/` | HTTP 200 for `index.html`, the built JavaScript file, and the built CSS file. |

The built CSS contains the theme colors `#f4f1ea` and `#0c5f5a`.

### Behaviour covered by those tests

| Case | Expected | Result |
| --- | --- | --- |
| Income 100 and expenses 40 + 25.50 | Income 100, expenses 65.50, net 34.50 | Passed in Vitest |
| Empty list | All totals 0, label Even | Passed in Vitest |
| Expenses greater than income | Negative net, label Deficit | Passed in Vitest |
| 10.10 + 10.20 | 20.30 | Passed in Vitest |
| Edit or delete a row in the array | Totals follow the new array | Passed in Vitest |
| Salary income plus food and rent expenses | Category list has no Salary | Passed in Vitest |
| Demo amounts | 48500, 14950, 33550; Food 2640 | Passed in Vitest |
| `formatINR(48500)` | Contains `₹` and `48,500` | Passed in Vitest |
| Blank form, `0`, `-5`, `abc`, `10.555`, `1,000` | Rejected with an amount or field error | Passed in Vitest |
| Amount above 10,00,00,000 | Rejected | Passed in Vitest |
| Expense category “Salary” | Rejected | Passed in Vitest |
| 31 February, year 1999, wrong date shape | Rejected | Passed in Vitest |
| Search “milk” and “poster” | Groceries and Weekend freelance | Passed in Vitest |
| Search “Entertainment” | No row, because search ignores the category name | Passed in Vitest |
| Current month filter | Salary kept, Movie night excluded | Passed in Vitest |
| Missing storage key | Demo saved once; second load keeps the same ids | Passed in Vitest |
| Stored `[]` | Stays empty | Passed in Vitest |
| Stored `{bad` or a non-array | Warning, stored text unchanged | Passed in Vitest |
| Add Scholarship of ₹1000 | Income becomes 49500 and survives remount | Passed in Testing Library |
| Invalid amount on the form | Dialog stays open, income stays 48500 | Passed in Testing Library |
| Cancel delete, then confirm delete of salary | Row remains after Cancel; income becomes 6500 after confirm | Passed in Testing Library |
| Edit Groceries from 1860 to 2000 | Expenses become 15090 | Passed in Testing Library |
| Search, then open Dashboard | Dashboard income and expenses stay 48500 and 14950 | Passed in Testing Library |
| Reset after confirmation | Scholarship is gone and income returns to 48500 | Passed in Testing Library |
| Render with broken JSON already stored | Warning visible, stored text still `{not json` | Passed in Testing Library |

Testing Library runs in jsdom. It does not apply the real layout, so it does not prove the phone or desktop spacing.

### Manual checks still to do before submission

| Case | Result |
| --- | --- |
| Dashboard, form, filters, and About on a desktop window | Not run in a graphical browser in the implementation session |
| Same screens at a phone width | Not run in a graphical browser in the implementation session |
| Tab order, visible focus, and Escape to close | Not run in a graphical browser in the implementation session |
| Public Vercel URL | Not deployed in the implementation session |

[Insert screenshot: Dashboard on a laptop]

[Insert screenshot: Add transaction dialog with a validation error]

[Insert screenshot: Transactions page with search and filters]

[Insert screenshot: Delete confirmation]

[Insert screenshot: About page and reset confirmation]

[Insert screenshot: Phone width with the compact navigation]

## 14. Deployment

1. Create a Git repository whose root is this project folder.
2. Push it to GitHub. Do not commit `node_modules` or `dist`.
3. Import the repository in Vercel.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Add no environment variables.
8. Deploy and open the public URL.
9. Add a row, refresh, and confirm it remains.
10. Open the URL in another browser profile and confirm it has its own list.

`vercel.json` is omitted on purpose. The app has one page, so Vercel does not need to rewrite paths to `index.html`.

A new deployment replaces the JavaScript and CSS. It does not transfer `localStorage` from the developer’s laptop to a visitor.

## 15. Limitations

- Records are visible to anyone who can use this browser profile.
- The app cannot restore data after site data is cleared.
- Two devices do not share a list.
- Categories cannot be invented in the form; they come from a fixed list.
- There is no audit log, backup, or password.
- The project should not be described as a secure or bank-linked financial product.

## 16. Future scope

These items are ideas only. They are not built.

- Export the list to CSV.
- A monthly budget beside the category bars.
- Optional cloud backup with a real account system.
- More than one currency, with an explicit exchange rule.
- A chart library, if the category list becomes too long for CSS bars.

Any cloud feature would need a privacy explanation that this version does not need, because this version does not upload the list.

## 17. Conclusion

The project meets the mini-project goal: a small React application that records income and expenses, checks the form, calculates totals from the saved rows, and keeps those rows in the browser. The code is split into types, storage, calculations, and screens so each part can be explained on its own. Deployment is a static Vite build. The storage warning in the app, and this report, both keep the project inside that limit.

## References

1. React documentation. https://react.dev/
2. Vite guide. https://vite.dev/guide/
3. TypeScript handbook. https://www.typescriptlang.org/docs/
4. Tailwind CSS documentation. https://tailwindcss.com/docs
5. Lucide icons. https://lucide.dev/
6. MDN, `Window.localStorage`. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
7. MDN, `Intl.NumberFormat`. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
8. Vercel, Vite deployments. https://vercel.com/docs/frameworks/frontend/vite
