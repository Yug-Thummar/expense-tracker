# Project Title

Expense Tracker — Personal Income and Expense Notebook using React and LocalStorage

**Student name:** [Your Name]

**Roll number:** [Your Roll Number]

**Class / semester:** [Your Class / Semester]

**Department:** [Department Name]

**College:** [College Name]

**Guide:** [Guide Name]

**Academic year:** [Academic Year]

**Subject:** [Subject Name]

---

## LIST OF TABLES

- Table 1: Existing system versus proposed system
- Table 2: Hardware and software requirements
- Table 3: Transaction fields
- Table 4: Demo records
- Table 5: Pages and screens
- Table 6: Manual test cases

## LIST OF FIGURES

- Figure 1: High-level architecture
- Figure 2: Data flow of the application
- Figure 3: Add, edit, and delete workflow
- Figure 4: First-load storage workflow
- Figure 5–11: Screenshot placeholders (to be pasted by the student)

---

# CHAPTER 1

## INTRODUCTION

A personal budget is not only a list of numbers. It is also a daily process: money comes in, money goes out, and at the end the person wants to know what is left. If this process is done only in memory, or only in scattered notes, three common problems appear.

First, the total is uncertain. A person may remember the salary and forget the small food bills. Second, search is slow. Finding one payment in a long notebook takes time. Third, income and expense are easy to mix. A number written without a type does not say whether it was received or spent.

Computer software can help. Banks and large finance apps track money, but they need accounts, servers, and private data. A college mini project does not need that size. It needs a complete, working, understandable application that shows the same idea on a smaller scale.

Expense Tracker is that smaller system. It looks like a quiet personal-finance dashboard. On the left (or in a compact mobile bar) the user can open three sections:

1. Dashboard — income, expenses, balance, recent rows, and spending by category
2. Transactions — the full list, with add, edit, delete, search, and filters
3. About / Help — how data is stored, and how to restore the demo list

The project is written so that a beginner can read the code. Business rules such as “do not save a zero amount” and “net balance is income minus expenses” live in small utility files. The screens only show forms, cards, and lists. This separation is important. If each screen kept its own copy of the totals, those numbers could become wrong after an edit or a delete.

This report is the academic document for the project. It does not replace the running website. After reading it, a student should be able to start the app, explain every feature, and answer viva questions about React, LocalStorage, validation, calculations, and deployment.

---

# CHAPTER 2

## PROBLEM STATEMENT

A student, or a lab that wants to demonstrate a personal notebook, needs software that can answer these questions:

1. Which income and expense records exist?
2. What is the total income?
3. What is the total spent?
4. What is left after expenses are subtracted from income?
5. Which expenses belong to food, rent, travel, and the other categories?
6. After a page refresh, is the same list still there?

If these questions are answered only in memory, or only on paper, the notebook is not reliable. If they are answered by a bank API or a database server, the student may spend more time on installation than on the calculation rules.

Therefore the problem of this project is:

Design and implement a complete Expense Tracker as a web dashboard that supports transaction records, search and filters, category spending, and persistence, without using a backend or a database server, and that a beginner can install, demonstrate, and deploy.

The solution must also refuse invalid work:

- a transaction cannot be saved without a title, a type, a category, and a valid date
- the amount must be a finite number greater than zero
- zero, negative, and non-numeric amounts are rejected
- dashboard totals must be calculated from the transaction list, not stored as a second set of numbers
- category spending must add expenses only
- deleting a record must ask for confirmation
- demo data must not overwrite a list the user has already saved

---

# CHAPTER 3

## OBJECTIVES

The project was built to meet the following objectives.

### Primary objectives

1. To study a real personal-budget problem and convert it into software features.
2. To design a clean, responsive dashboard for desktop, tablet, and mobile screens.
3. To implement transaction Create, Read, Update, Delete (CRUD) with search and filters.
4. To calculate total income, total expenses, and net balance from the saved list.
5. To show expense totals by category, and to leave income out of that chart.
6. To store transactions in the browser using LocalStorage, with safe JSON reading.
7. To seed sample data only when the application has no saved key.
8. To provide a Reset Demo Data action with a confirmation dialog.
9. To document the project for submission and viva.
10. To deploy the production build as a static website on Vercel.

### Learning objectives

- Understand component-based UI in React.
- Understand why a small app can switch screens in state without a router.
- Understand why TypeScript types reduce mistakes.
- Understand the difference between LocalStorage and a real database.
- Understand validation and why totals must be derived from the rows.

---

# CHAPTER 4

## SCOPE OF THE PROJECT

### 4.1 In scope

The following work is included and implemented:

- One dashboard application with three sections
- Transaction records with unique id, title, positive amount, type, category, date, optional note, and created time
- Search by title or note
- Filter by type, category, and month
- Edit and delete, with confirmation before delete
- Automatic totals: income, expenses, and net balance
- Recent activity on the dashboard (up to five rows)
- Simple category visualization (CSS bars for expenses only)
- Success messages, form errors, empty states, and storage warnings
- Responsive layout: sidebar on desktop, compact navigation on mobile
- About page that explains LocalStorage
- A Vite production build suitable for Vercel, with no environment variables

### 4.2 Out of scope

The following items are not part of this mini project:

- Login, passwords, or user roles
- A shared database used by many computers at the same time
- Bank, UPI, or card connections
- Budgets, bills, receipts, or tax reports
- Email, SMS, or WhatsApp reminders
- A chart library
- Multiple currencies
- Backend frameworks such as Express, and databases such as MongoDB, MySQL, Firebase, or Supabase

These items can be future work. They were left out so that the project stays complete instead of half-finished.

---

# CHAPTER 5

## EXISTING SYSTEM AND PROPOSED SYSTEM

### 5.1 Existing system

In daily student life, money is still tracked in one of these ways:

- Memory: the person remembers the big payments and forgets the small ones.
- A paper notebook: the writer notes a title and an amount. Searching is slow. Income and expense can be mixed up.
- A spreadsheet: better for sums, but the total cells are typed or copied by hand. If one cell is wrong, the balance is wrong.
- A bank app: correct for a real account, but it needs a login, a bank, and private data that a college demo should not collect.

Common weaknesses of the paper / memory method:

- no automatic balance
- no protection against a blank title or a zero amount
- no single screen that shows income, expenses, and what is left
- difficult to demonstrate the same data after a refresh

### 5.2 Proposed system

Expense Tracker proposes a browser dashboard that:

- stores structured income and expense records
- calculates totals from that list every time the screen is shown
- shows spending by category for expenses only
- can be opened on a laptop or a phone
- can be hosted on Vercel without paying for a database

**Table 1: Existing system versus proposed system**

| Point | Existing / common practice | Proposed Expense Tracker |
| --- | --- | --- |
| Record list | Memory, notebook, or Excel | Searchable list on a web page |
| Balance | Added by hand | Income minus expenses, from the rows |
| Income vs expense | Easy to mix | A required type on every row |
| Category spending | Counted by hand | Bars built from expense rows only |
| Finding one item | Scanning pages | Search and filters |
| Sharing | One notebook | One browser only (honest limit) |
| Demo in lab | Slow | `npm run dev` or a Vercel link |
| Cost | Paper / Excel / a bank app | Free student tools + free static hosting |

The proposed system is not a replacement for a bank app. It is a teaching model of a personal notebook.

---

# CHAPTER 6

## LITERATURE / TECHNOLOGY BACKGROUND

This chapter explains the tools, in simple language, so that they can be spoken in a viva.

### 6.1 React

React is a JavaScript library for building user interfaces. The screen is divided into components. A button, a card, a form, and a whole page can each be a component. When data changes (for example, a transaction is added), React updates the parts that read that list.

In this project, screens such as `DashboardView` and `TransactionsView` are components. Smaller parts such as `SummaryCards`, `Dialog`, and `EmptyState` are reused.

### 6.2 Vite

Vite is the tool that runs the project in development and builds it for production. In development it starts a local server (usually port 5173). For deployment it creates a `dist` folder of HTML, CSS, and JavaScript. Vercel then hosts that folder.

### 6.3 TypeScript

TypeScript adds types to JavaScript. A transaction must have a title, an amount, a type, and so on. If the programmer forgets a field, the editor or `npm run build` can show an error. This is useful in a college project because the examiner can see that the data model is planned, not guessed.

### 6.4 Tailwind CSS

Tailwind is a utility CSS framework. Instead of writing a long CSS file for every page, the developer uses classes such as `rounded-2xl`, `text-sm`, and `lg:flex`. This keeps spacing and colors consistent. This project uses Tailwind CSS 4 through the Vite plugin. The colors are set in `src/index.css`. There is no separate `tailwind.config.js`.

### 6.5 Screen switching

This mini project has three screens, but it does not use React Router. `App.tsx` stores the current screen name: `dashboard`, `transactions`, or `about`. The sidebar and the mobile bar change that name. The browser address stays on one page.

That choice keeps the project smaller. It also means a refresh always opens the Dashboard screen again. The saved records remain, because they live in LocalStorage, not in the screen name.

Because the address does not change, the project does not include `vercel.json`. A rewrite file would be needed only if the app used paths such as `/books`.

### 6.6 LocalStorage

LocalStorage is a feature of the web browser. The website can save a text string under a name (a key). After refresh, the same string can be read again. In this project the key is `expense-tracker.transactions.v1`, and the string is a JSON array of transactions.

LocalStorage is not a database. It cannot be shared easily with another computer. It can be deleted by the user. The About page and this report both state that limit clearly.

### 6.7 Lucide React

Lucide is a free icon set. Icons for the dashboard, income, expense, edit, and delete make the interface easier to scan. The word Income or Expense is still printed, so meaning does not depend on the icon alone.

### 6.8 Vercel

Vercel is a hosting service that can publish a Vite project from GitHub. The student does not configure a Linux server. The build command is `npm run build` and the output folder is `dist`. No environment variable is required. Vercel hosts the website files. It does not receive the transaction list.

---

# CHAPTER 7

## SOFTWARE AND HARDWARE REQUIREMENTS

**Table 2: Hardware and software requirements**

| Type | Requirement |
| --- | --- |
| Hardware | Any normal laptop or desktop; 4 GB RAM is enough |
| Operating system | Windows, macOS, or Linux |
| Browser | Chrome, Edge, Firefox, or another modern browser |
| Software | Node.js `^20.19.0` or `>=22.12.0`, and npm |
| Optional | Git, GitHub account, Vercel account |
| Display | Desktop, tablet, or mobile width; the layout adapts |

No paid API key is required. No database software is required.

This copy was developed and checked with Node.js `v24.21.0` and npm `11.4.2`.

---

# CHAPTER 8

## SYSTEM ANALYSIS

### 8.1 Users

This mini project has one user role: the person keeping their own notebook. There is no login. The same person adds income, adds expenses, and reads the balance. This matches a classroom demo.

### 8.2 Functional requirements

FR1. The system shall display total income, total expenses, and net balance.

FR2. The system shall allow adding a transaction with title, positive amount, type, category, date, and optional note.

FR3. The system shall allow editing a transaction without changing its id.

FR4. The system shall allow deleting a transaction only after confirmation.

FR5. The system shall allow searching by title or note, and filtering by type, category, and month.

FR6. The system shall calculate dashboard totals from every saved transaction.

FR7. The system shall show a separate matching summary for the filtered list.

FR8. The system shall show up to five recent transactions and expense totals by category.

FR9. The system shall format money in Indian rupees.

FR10. The system shall save data in LocalStorage and reload it after refresh.

FR11. The system shall load sample data only when the storage key is missing.

FR12. The system shall allow resetting demo data after confirmation.

FR13. The system shall refuse a blank title, an unknown type, an unknown category, an invalid date, and an amount that is not a positive number.

### 8.3 Non-functional requirements

NFR1. The interface should be readable and consistent (warm off-white background, white cards, teal accent).

NFR2. Summary cards should stack on a narrow screen, and transaction rows should not force horizontal scrolling.

NFR3. Forms should have labels, errors, and keyboard-friendly dialogs.

NFR4. Save failures (storage blocked or full) should show a message, not a silent failure.

NFR5. The production build should be static files suitable for Vercel, with no secrets.

### 8.4 Feasibility

- Technical feasibility: React and LocalStorage are standard and free.
- Economic feasibility: No server rent and no paid API.
- Operational feasibility: A student can run the app with two commands (`npm install`, `npm run dev`).
- Schedule feasibility: The feature set is small enough for a mini project timeline.

---

# CHAPTER 9

## SYSTEM DESIGN AND ARCHITECTURE

### 9.1 High-level architecture

Expense Tracker is a single-page application. The browser downloads one website. React then shows different screens inside it. The address bar does not change.

```text
                    ┌─────────────────────────────┐
                    │         Web Browser         │
                    │  (Chrome / Edge / Firefox)  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     React user interface    │
                    │  Dashboard / Transactions   │
                    │  / About + shared widgets   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │    useTransactions hook     │
                    │  add / edit / delete / reset│
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     storage.ts service      │
                    │   read / write / validate   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Browser LocalStorage      │
                    │ key: expense-tracker.       │
                    │      transactions.v1        │
                    └─────────────────────────────┘
```

Figure 1: High-level architecture

There is no API layer. There is no environment-variable file. The website itself is the whole system.

### 9.2 Logical layers

1. Presentation layer — views and components the user sees.
2. Application layer — `useTransactions` applies save, delete, and reset.
3. Rules layer — `validation.ts`, `calculations.ts`, and `filters.ts`.
4. Persistence layer — `storage.ts` reads and writes JSON.

This is similar to a layered design, but the “database” is LocalStorage.

### 9.3 Folder design

The source code is split so that a beginner can find things:

- `src/views` — the three screens
- `src/components` — layout, form, dialogs, cards, list, filters
- `src/hooks` — shared transaction state and messages
- `src/services` — LocalStorage
- `src/utils` — money, dates, ids, validation, statistics, filters
- `src/data` — categories and the sample list used only for first visit / reset
- `src/types` — the transaction shape

### 9.4 Screen design

**Table 5: Pages and screens**

| Screen | How it opens | Purpose |
| --- | --- | --- |
| Dashboard | Default, and the Dashboard control | Summary, recent rows, category bars |
| Transactions | Transactions control | Full list, form, search, and filters |
| About / Help | About control | Storage explanation and demo reset |
| Any refresh | App starts on Dashboard again | Records remain in LocalStorage |

There is no `/books` style route. One HTML page contains all three screens. On Vercel, the public URL is that one page. A rewrite file is not used.

---

# CHAPTER 10

## FEATURES OF THE PROJECT (DETAILED)

This chapter is the heart of the report. It lists what the project contains and what the user can do.

### 10.1 Feature 1 — Dashboard overview

When the app opens, the Dashboard shows three cards:

1. Total Income — the sum of every income amount
2. Total Expenses — the sum of every expense amount
3. Net Balance — total income minus total expenses

Each card also uses words, not color alone. Income says “Money received”. Expenses say “Money spent”. The balance says Surplus, Deficit, or Even.

The dashboard also has:

- a recent activity list (up to five latest records, with edit and delete)
- a spending-by-category panel (expenses only)
- CSS bars that compare categories with each other

This feature answers the first question: “How does the notebook look today?”

### 10.2 Feature 2 — Transaction management (CRUD)

The Transactions page is the full notebook. The same actions are also available from the recent list on the Dashboard.

- Create: Add transaction opens a dialog. The user enters title, amount, type (Income or Expense), category, date, and an optional note.
- Read: Each row shows the title, note, category, date, amount, and the word Income or Expense.
- Update: Edit opens the same form with the old values. The id and the created time stay the same.
- Delete: Delete asks for confirmation. Cancel keeps the row. Confirm removes it and saves the shorter list.

### 10.3 Feature 3 — Search and filter

The user can type in the search box. The app matches the title and the note. It does not treat the category name as a search field.

Three extra controls narrow the list:

- Type — all, income, or expense
- Category — the categories that belong to the selected type, or all categories
- Month — a month input; blank means every month

Under the filters, the page shows how many rows match, plus matching income, matching expenses, and matching net. Those matching numbers are not the dashboard totals.

### 10.4 Feature 4 — Category spending

The Dashboard draws one bar per expense category. Income categories such as Salary are not included. The longest bar is the largest expense category. The percentage is that category’s share of total expenses.

The drawing is plain CSS. No chart library is installed.

### 10.5 Feature 5 — Rupee formatting

Every amount the user sees goes through `Intl.NumberFormat` with the locale `en-IN` and the currency `INR`. The symbol is `₹`, and grouping follows the Indian style, for example `₹48,500.00`.

### 10.6 Feature 6 — Over-spend is visible

The program does not block a notebook that spends more than it receives. Net balance is allowed to be negative. The card then says Deficit, and the formatted amount shows the minus sign. This is a notebook, not a bank that refuses a payment.

### 10.7 Feature 7 — Persistence after refresh

If the user adds a transaction and refreshes the page, the transaction is still there (same browser). The screen opens on the Dashboard again, because the screen name is not stored in the address. The list itself is in LocalStorage.

### 10.8 Feature 8 — Demo data and reset

On the first visit, when the key `expense-tracker.transactions.v1` is missing, the app saves sample rows such as Monthly salary, Room rent, Groceries, and Movie night. Movie night is placed on the 15th of the previous month so the month filter has a contrast. The other sample dates are counted backward from the day of that first save.

Later visits do not overwrite the user’s work. An empty list is also a real saved state. Deleting every row does not bring the demo back by itself.

Reset demo data on the About page asks for confirmation. If the user confirms, the sample list replaces the current records in this browser.

From the sample amounts, the dashboard shows:

- Total income: ₹48,500
- Total expenses: ₹14,950
- Net balance: ₹33,550 (Surplus)
- Food expenses: ₹2,640

### 10.9 Feature 9 — About / Help

The About page explains, in plain language:

- what the project does
- how LocalStorage works
- the formulas for income, expenses, balance, and category totals
- how to use the screens
- why reset needs confirmation
- why this is not a bank product and not a multi-user server

### 10.10 Feature 10 — Responsive and accessible interface

- Desktop: left sidebar, wide content
- Mobile: the sidebar is hidden and a three-button bar sits under the title
- Summary cards stack on a narrow screen
- Transaction rows stack so the page does not scroll sideways
- Dialogs can be closed with Escape, the close control, or Cancel
- Delete confirmation focuses Cancel first
- Buttons have visible focus
- Income and expense are shown with words and icons, not only color

### 10.11 Feature 11 — Feedback (messages and errors)

A successful add, edit, delete, or reset shows a short message. Success messages disappear after about 4 seconds. Errors stay until the user dismisses them. Form mistakes (blank title, amount `0`, amount `abc`, missing type) stay on the form so the user can correct them. If the browser blocks storage, a warning remains on the page.

### 10.12 Feature 12 — Ready for Vercel

The project builds to a `dist` folder. The build command is `npm run build`. The output directory is `dist`. No secret file is required. `vercel.json` is not included, because the app does not use path-based routes.

---

# CHAPTER 11

## HOW THE PROJECT WORKS

This chapter explains the working of the system from the moment the website opens.

### 11.1 Starting the application

The student runs `npm run dev`. Vite serves the React app. The browser opens `index.html`, which loads `src/main.tsx`. `main.tsx` renders `App` inside React `StrictMode`.

`App` holds:

1. `useTransactions` — the list, warnings, and save actions
2. the current screen name
3. the add/edit dialog
4. the delete confirmation
5. `AppShell` — sidebar, mobile bar, and page content

### 11.2 Loading data

When `useTransactions` is created, it calls `loadTransactions()`.

```text
Is LocalStorage readable?
        │
        ├── No  → show an empty list and a warning
        │
        └── Yes
              │
              Read key expense-tracker.transactions.v1
              │
              ├── Key missing → write demo data, use demo data
              ├── JSON damaged, or value is not an array
              │       → show an empty list and a warning
              │         leave the stored text unchanged
              ├── Array with some bad rows
              │       → show the valid rows, warn about the skipped ones
              │         leave the stored text unchanged until the next save
              └── JSON array of valid rows
                      → use that list
                        (even if the user deleted everything and saved [])
```

Figure 4: First-load storage workflow

This is why sample rows appear on a first demo, and why they do not keep coming back after the student deletes them and the empty list is saved (unless Reset is used).

### 11.3 How a click becomes saved data

Example: the user adds Dinner as an expense of ₹500.

1. The form sends the field values to `validateTransaction`.
2. If a field is invalid, the dialog stays open and shows the errors.
3. If the values are valid, `addTransaction` creates an id and a `createdAt` time.
4. It builds a new array: the new row plus the previous rows.
5. `saveTransactions` writes `JSON.stringify` of that array to LocalStorage.
6. If writing fails, the screen keeps the old list and an error message appears.
7. If writing succeeds, React state updates. The Dashboard cards, the recent list, the category bars, and the Transactions page all change together, because they read the same array.

```text
User clicks “Save transaction”
        → TransactionFormDialog
        → validateTransaction()
        → addTransaction() or updateTransaction()
        → new array of transactions
        → saveTransactions()
        → LocalStorage JSON array
        → React re-renders the open screen
```

Figure 2: Data flow of the application

### 11.4 How totals stay consistent

The most important working rule is:

Totals are not a second record the user edits. They are the result of adding the current rows.

- Total income = sum of amounts where type is income
- Total expenses = sum of amounts where type is expense
- Net balance = total income − total expenses
- Category total = sum of expense amounts in that category
- Edit replaces one row, then the sums are calculated again
- Delete removes one row, then the sums are calculated again

Because every screen calls `getSummary` on the list it is given, the cards cannot keep an old total after a save.

The dashboard always passes the full list. The Transactions page passes the filtered list only for the “Matching” line.

### 11.5 How money is added

JavaScript decimal numbers can be slightly inaccurate. The project converts each amount to paise (`Math.round(amount * 100)`), adds those whole numbers, and divides by 100. A check in the test suite expects `10.1 + 10.2` to equal `20.3`.

### 11.6 How search works

Search does not call a server. It filters the array already in memory.

A row matches when all of these are true:

- the type filter is “all”, or the row type matches
- the category filter is “all”, or the row category matches
- the month box is empty, or the date starts with that `YYYY-MM`
- the query is empty, or the lowercase title plus note contains the lowercase query

This is fast enough because a mini-project list is small.

### 11.7 How reset works

Reset does not delete the LocalStorage key and wait for the next visit. It builds a fresh demo array, writes that array under the same key, and updates the screen. The confirmation dialog exists so that a student does not replace a filled notebook by accident.

---

# CHAPTER 12

## DATA MODELS

One main record is stored. There is no separate “totals” record and no separate user record.

### 12.1 Transaction

**Table 3: Transaction fields**

| Field | Meaning | Required |
| --- | --- | --- |
| id | Unique code from `crypto.randomUUID()` when the browser supports it | Yes (auto) |
| title | Short name of the income or expense | Yes, 1–60 characters |
| amount | Positive rupees, up to 2 decimal places, at most ₹10,00,00,000 | Yes |
| type | `income` or `expense` | Yes |
| category | One value from the list for that type | Yes |
| date | Calendar date `YYYY-MM-DD`, year 2000 through 2100 | Yes |
| note | Extra text | No, up to 200 characters |
| createdAt | Time the row was created; used when two rows share a date | Yes (auto) |

The form starts with `amount` as text, because the user might type `abc` or `0`. Only a valid number is stored.

Income categories: Salary, Freelance, Gift, Other.

Expense categories: Food, Transport, Rent, Utilities, Shopping, Health, Education, Entertainment, Other.

If the user changes the type, a category that does not belong to the new type is cleared.

### 12.2 Demo records

**Table 4: Demo records**

| Title | Type | Category | Amount (₹) | When it is dated | Note |
| --- | --- | --- | --- | --- | --- |
| Monthly salary | Income | Salary | 42000 | The day the demo is saved | Monthly stipend |
| Weekend freelance | Income | Freelance | 6500 | 1 day earlier | Poster design |
| Room rent | Expense | Rent | 10000 | 2 days earlier | Shared apartment |
| Groceries | Expense | Food | 1860 | 3 days earlier | Vegetables and milk |
| Metro pass | Expense | Transport | 450 | 4 days earlier | (none) |
| Electricity bill | Expense | Utilities | 1240 | 5 days earlier | Room share |
| Dinner with friends | Expense | Food | 780 | 6 days earlier | Campus cafe |
| Movie night | Expense | Entertainment | 620 | Day 15 of the previous month | Tickets with friends |

Demo ids are created when the demo is saved. They are not fixed codes such as `tx-001`. After a reset, the new demo rows receive new ids. The amounts above stay the same.

### 12.3 Stored document

Everything is one JSON array:

```json
[
  {
    "id": "…",
    "title": "Monthly salary",
    "amount": 42000,
    "type": "income",
    "category": "Salary",
    "date": "2026-10-24",
    "note": "Monthly stipend",
    "createdAt": "2026-10-24T08:00:00.000Z"
  }
]
```

Browser key: `expense-tracker.transactions.v1`.

The `v1` in the key lets a future student change the shape without silently mixing it with this array.

---

# CHAPTER 13

## ALGORITHMS AND WORKFLOWS

### 13.1 Add transaction

1. Read the form.
2. Trim spaces from the title and the note.
3. If the title is empty → error. If it is longer than 60 characters → error.
4. If the amount is empty, zero, negative, not numeric, uses a comma, has more than 2 decimal places, or is above ₹10,00,00,000 → error.
5. If the type is not income or expense → error.
6. If the category is empty, or is not in the list for that type → error.
7. If the date is empty or is not a real date from 2000 to 2100 → error.
8. If the note is longer than 200 characters → error.
9. Create an id and `createdAt`.
10. Save the new array. If saving fails, keep the old list.

### 13.2 Edit transaction

1. Open the form with the selected row.
2. Run the same validation.
3. If that id is no longer in the list → error.
4. Replace the fields on that id. Keep `id` and `createdAt`.
5. Save the full array.

### 13.3 Delete transaction

1. The user chooses Delete.
2. A dialog asks for confirmation. Escape or Cancel stops here.
3. Confirm removes that id.
4. Save the remaining array.
5. Totals are calculated again from what is left.

```text
Open form or choose Delete
        →
Validate (add / edit) or confirm (delete)
        →
Valid and storage writable?
        ├── No  → show the error, keep the old list
        └── Yes → write the new JSON array
                  close the dialog
                  show a success message
                  recalculate cards from the array
```

Figure 3: Add, edit, and delete workflow

### 13.4 Dashboard statistics

- Total income = sum of income amounts
- Total expenses = sum of expense amounts
- Net balance = total income − total expenses
- Recent rows = the list sorted by date, then by `createdAt`, then the first five
- Category bars = expense amounts grouped by category, largest first

### 13.5 Identifier algorithm

New records call `createId()`. The function uses `crypto.randomUUID()` when the browser supports it. If not, it uses the current time plus a random suffix. An edit does not call `createId()` again.

### 13.6 Filter algorithm

Start with the full array. Drop rows that fail the type test, then the category test, then the month test, then the search test. Sort the remaining rows for display. Call `getSummary` on that smaller array for the matching line only.

---

# CHAPTER 14

## USER INTERFACE AND MODULES

### 14.1 Layout module

`AppShell` draws the shell:

- brand name Expense Tracker
- navigation controls
- a short note that records stay in this browser
- page title and description from the open screen
- a warning banner if storage could not be read
- toast messages above the page
- the mobile bar when the window is narrow

Reset demo data lives on the About screen, not as a silent button.

### 14.2 Dashboard module

File: `src/views/DashboardView.tsx`

Purpose: give a one-screen summary. The user can still add, edit, or delete from the recent list. The cards themselves are read-only.

### 14.3 Transactions module

File: `src/views/TransactionsView.tsx`

Form: `src/components/TransactionFormDialog.tsx`

Filters: `src/components/TransactionFilterBar.tsx`

Purpose: the full notebook. Add and edit use the same form so the rules stay the same.

### 14.4 About module

File: `src/views/AboutView.tsx`

Purpose: tell the truth about browser storage, explain the formulas, and offer the confirmed reset. This is part of the academic honesty of the project.

### 14.5 Shared UI module

Reusable pieces:

- `Dialog` — add, edit, and confirm windows, with Escape and a focus loop
- `ConfirmDialog` — delete and reset
- `SummaryCards` — the three totals
- `TransactionList` — rows with Income/Expense labels
- `CategoryBreakdown` — expense bars
- `EmptyState` — a message when a list is empty
- `Banner` and `StorageWarning` — success, error, and storage messages

Using shared components keeps the look consistent and avoids copy-paste.

### 14.6 Visual design

The design is meant to feel like a calm notebook, not a neon finance ad:

- warm off-white page background (`#f4f1ea`)
- white cards
- dark navy text (`#172033`)
- one teal accent (`#0c5f5a`)
- a clay color for expenses, together with the word Expense
- soft borders and a light card shadow
- Manrope for the UI, with Segoe UI as the fallback if the webfont does not load

There are no fake statistics and no extra unused pages.

---

# CHAPTER 15

## IMPLEMENTATION DETAILS

### 15.1 Tools used in the actual project

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS 4
- Lucide React
- Vitest 5 and Testing Library, for the checks described in Chapter 17
- Oxlint, the linter from the Vite template
- npm

React Router is not installed. A state library such as Redux is not installed.

### 15.2 Important source files

| File | Responsibility |
| --- | --- |
| `src/types/transaction.ts` | Transaction, form, and filter types |
| `src/services/storage.ts` | Load, save, parse, seed-once rule |
| `src/hooks/useTransactions.ts` | Add, edit, delete, reset, and messages |
| `src/utils/validation.ts` | Form checks |
| `src/utils/calculations.ts` | Income, expenses, balance, categories |
| `src/utils/filters.ts` | Search, type, category, and month |
| `src/utils/money.ts` | Rupee format and paise sums |
| `src/utils/dates.ts` | Today, display dates, valid dates |
| `src/utils/id.ts` | Unique ids |
| `src/data/demoTransactions.ts` | Sample list |
| `src/data/categories.ts` | Allowed categories |
| `src/views/*.tsx` | Screens |
| `src/App.tsx` | Screen switch, form, and delete dialog |

There is no `vercel.json` in this project.

### 15.3 Why one hook is used

A beginner might store the list inside the Transactions screen and calculate different totals inside the Dashboard. That would be a mistake, because an edit must change both screens. `useTransactions` is a simple shared box. `App` owns it and passes the same array down. This is not Redux. No extra state library was added.

### 15.4 Why the amount is positive and the type is separate

If a negative number could mean either “a refund” or “an expense”, the sums would be easy to get wrong. The form stores a positive amount and asks the user to choose Income or Expense. Category spending then ignores every income row.

### 15.5 Safe JSON parsing

`JSON.parse` can throw if the text is broken. `storage.ts` wraps reading and parsing in `try/catch`. It checks that each object has the right fields, a known type, a known category, a positive amount, and a real date. A broken file does not crash the page, and it is not replaced until the user successfully saves a new list. Invalid objects inside an otherwise valid array are skipped and counted in a warning.

### 15.6 Deployment implementation

`npm run build` runs TypeScript (`tsc -b`) and then Vite. The result is static files in `dist`. Vercel does not need environment variables. Because navigation does not change the URL, a rewrite to `index.html` is not required for this version.

If a later student adds real paths such as `/transactions`, they should add a rewrite then. That file is not part of the current build.

---

# CHAPTER 16

## INPUT VALIDATION AND ERROR HANDLING

Validation protects the notebook from garbage data.

### Transaction form

- Title required after trimming, at most 60 characters
- Amount required, greater than 0, at most 2 decimal places, no commas, at most ₹10,00,00,000
- Type must be Income or Expense
- Category required, and it must belong to that type
- Date required, a real calendar date from year 2000 through 2100
- Note optional, at most 200 characters

### Delete and reset

- Delete shows “Delete this transaction?” and does not remove the row on Cancel
- Reset shows “Replace the current list?” and does not replace the list on Cancel
- Both dialogs close with Escape

### Storage errors

- If LocalStorage cannot be read, the user is warned that records cannot be saved on this device
- If the saved text is not valid JSON, or is not an array, the user is warned and the stored text is left as it is
- If saving throws (storage full or blocked), an error message appears and the previous list stays on screen

The user sees either a form error or a message. There are no dummy buttons that do nothing.

---

# CHAPTER 17

## TESTING

During implementation, the project commands below were run on 24 October 2026 with Node.js `v24.21.0` and npm `11.4.2`:

| Command | Observed result |
| --- | --- |
| `npm test` | Passed. Vitest 5.0.5. 5 files, 38 tests. |
| `npm run lint` | Passed. Oxlint printed no warnings. |
| `npm run build` | Passed. TypeScript and Vite wrote `dist`. |
| `npm run preview` | The local preview returned HTTP 200 for the built page, its JavaScript, and its CSS. |

Those automated tests cover the formulas, invalid amounts, filters, the seed-once rule, broken JSON, and the main add, edit, delete, search, and reset actions in a simulated page (jsdom). They do not measure a real phone or laptop layout.

The correct statement for the manual table is:

Fill the Result column after you click through the app. Do not write “Pass” until you have performed the step.

**Table 6: Manual test cases**

| ID | Test case | Steps | Expected result | Result (fill) |
| --- | --- | --- | --- | --- |
| T01 | First visit | Open the app in a clean browser | Sample rows appear; income ₹48,500, expenses ₹14,950, net ₹33,550 | |
| T02 | Refresh | Reload the page | The same records remain; the screen opens on the Dashboard | |
| T03 | Add expense | Add a valid expense | New row; expense total increases by that amount | |
| T04 | Blank title | Save the form with an empty title | Error; nothing new is saved | |
| T05 | Zero amount | Enter amount `0` | Error about an amount greater than 0 | |
| T06 | Text amount | Enter `abc` | Same amount error; dashboard total unchanged | |
| T07 | Edit | Change Groceries and save | The row and the totals follow the new amount | |
| T08 | Cancel delete | Delete → Cancel | The row remains | |
| T09 | Confirm delete | Delete → Delete transaction | The row is gone and the totals change | |
| T10 | Search | On Transactions, search `milk` | Groceries remains; salary is hidden | |
| T11 | Dashboard after search | Return to Dashboard | Cards still use every saved row | |
| T12 | Month filter | Choose the previous month | Movie night can appear; the current salary month does not have to include it | |
| T13 | Category chart | Look at Spending by category | Salary is absent; Food includes groceries and dinner | |
| T14 | Reset | About → Reset demo data → Replace | Sample list comes back | |
| T15 | Cancel reset | Reset → Cancel | Current records stay | |
| T16 | Mobile width | Narrow the window | Cards stack; the top bar replaces the sidebar; rows stay readable | |
| T17 | Keyboard | Tab to a control; open a dialog; press Escape | Focus is visible; the dialog closes | |

A graphical browser pass of T16 and T17 was not completed in the implementation session. The student should do those two before the viva.

---

# CHAPTER 18

## SNAPSHOTS / SCREENSHOTS

Paste your own screenshots in the spaces below. Do not leave the boxes empty in the printed copy.

Figure 5 — Dashboard (desktop)

[Paste screenshot here]

Caption: Three summary cards, recent transactions, and spending by category.

Figure 6 — Dashboard cards on a narrow screen

[Paste screenshot here]

Caption: The income, expense, and balance cards stacked on a small width.

Figure 7 — Transactions page

[Paste screenshot here]

Caption: Search, type, category, and month filters above the list.

Figure 8 — Add / Edit transaction dialog

[Paste screenshot here]

Caption: Title, amount, income or expense, category, date, and optional note.

Figure 9 — Validation error

[Paste screenshot here]

Caption: The form stays open when the title or amount is invalid.

Figure 10 — Delete confirmation

[Paste screenshot here]

Caption: The row is removed only after Delete transaction is chosen.

Figure 11 — About / Help

[Paste screenshot here]

Caption: Explanation that LocalStorage belongs to this browser, and the reset action.

---

# CHAPTER 19

## LIMITATIONS

A good report tells the examiner what the software cannot do.

1. No multi-user sharing. Data is inside one browser profile. A second PC has a different notebook.
2. No login. Anyone who opens the site on that browser can change records.
3. Data can be lost. Clearing site data, using a private window, or changing browsers can erase the list.
4. Storage size is limited by the browser (usually a few megabytes). That is enough for a mini project, not for a company’s accounts.
5. No bank connection. The balance is only the sum of rows the user typed.
6. No budgets and no alerts when spending crosses a limit.
7. The category list is fixed. The user cannot invent a new category in the form.
8. The loan-style ideas of a library (due dates, fines, copies) do not apply here. This is an income and expense notebook.
9. Refresh opens the Dashboard screen again. The app does not remember that the user was on Transactions, because that choice is not stored in the URL.
10. Not an official finance product. It is an academic demonstration.

These limits were accepted so that the project could be finished and explained.

---

# CHAPTER 20

## CONCLUSION

The project Expense Tracker meets the aim of a college mini project: a complete, working personal notebook that a student can run and explain.

It provides a dashboard, full transaction CRUD, search and filters, category spending, rupee formatting, and persistence after refresh. Totals are calculated from the rows, so an edit or a delete cannot leave an old balance behind. The interface is simple and usable on a phone. The system can be hosted on Vercel without a database.

The most important technical lesson is this: a money program is not only a form that saves a name. It is a set of rules. Those rules — store a positive amount, mark income or expense, reject zero, confirm a delete, and add the list again after every change — are what make the software trustworthy.

The most important academic lesson is honesty about LocalStorage. The project solves the notebook problem for one browser. It does not pretend to be a bank, and it does not pretend that Vercel synchronizes the records.

---

# CHAPTER 21

## FUTURE ENHANCEMENT

If more time is given, the same project can grow in these directions:

1. Monthly budget — a limit beside each expense category.
2. CSV export / import — a backup file the student can download.
3. A chart library — only if the category list becomes too long for CSS bars.
4. Remember the open screen — for example with a URL, if the department wants refresh to stay on Transactions. That change would also need a Vercel rewrite.
5. Optional backend — an API plus a database, if the department wants the same notebook on two computers. The same transaction type can be reused.
6. Login — only after a real server exists. A fake password saved in LocalStorage is not real security.

These items are ideas only. They are not built in this submission.
