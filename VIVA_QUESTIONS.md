# Viva questions

Short answers for the Expense Tracker mini project. They match this codebase. If a function name is mentioned, open that file and point to it.

## React and the interface

1. **What is React doing in this project?**
   React draws the dashboard, the transaction list, and the dialogs. When the transaction array changes, React renders those parts again.

2. **What is a component here?**
   A component is a function that returns the markup for one piece of the page. `SummaryCards`, `TransactionList`, and `AboutView` are examples.

3. **What is state?**
   State is data React remembers between renders. The transaction list, the open screen, the form dialog, and the banner are state. Changing them with the state setter causes a new render.

4. **Why is there no Redux or other state library?**
   One list and a few dialogs fit in React state inside `App` and `useTransactions`. Another library would add code the project does not need.

5. **How do the three screens change?**
   `App` stores a view name: `dashboard`, `transactions`, or `about`. The sidebar and the mobile nav set that name. The URL does not change.

6. **What happens when the user clicks Add transaction?**
   `App` opens `TransactionFormDialog`. On submit, `validateTransaction` runs. A valid result is passed to `addTransaction`, which creates an id and asks `storage.ts` to save the new array.

7. **Why does the edit form show the old values?**
   `draftFromTransaction` copies the selected row into the form. The amount is shown with two decimal places. Saving writes those fields back onto the same id.

## Vite, TypeScript, and tooling

8. **What is Vite?**
   Vite is the development server and the production bundler. `npm run dev` serves the app. `npm run build` type-checks it and writes `dist`.

9. **What does `npm run build` run?**
   The script is `tsc -b && vite build`. TypeScript checks the project first. Vite then bundles the JavaScript and CSS into `dist`.

10. **Why use TypeScript?**
    A transaction has required fields and a type that can only be `income` or `expense`. TypeScript flags a mistake, such as passing a missing title, before the page runs.

11. **Where is the transaction type?**
    `src/types/transaction.ts`. The saved object, the form’s raw text, and the filter values are separate types because the form still contains unvalidated text.

12. **Why do imports end in `.ts` or `.tsx`?**
    The TypeScript config allows explicit file extensions, and the Vite template uses them. Vite understands those imports.

13. **Where are the colors defined?**
    In `src/index.css`, inside `@theme`. Tailwind v4 reads that file through `@tailwindcss/vite`. This project has no `tailwind.config.js`.

14. **What does `npm run lint` do?**
    It runs Oxlint, the linter shipped with the Vite React template. It reports problems such as incorrect hook use.

15. **What does `npm test` do?**
    It runs Vitest. The tests cover calculations, validation, filters, storage rules, and the main clicks in the rendered app.

## CRUD and validation

16. **What does CRUD mean here?**
    Create is add. Read is showing the list and the dashboard. Update is edit. Delete removes one id after confirmation.

17. **Which fields are required?**
    Title, amount, type, category, and date. The note is optional.

18. **What amounts are rejected?**
    Empty text, zero, negative numbers, text such as `abc`, scientific notation, commas, more than two decimal places, and amounts above ₹10,00,00,000. The check is the pattern and `Number` test in `validateTransaction`.

19. **Why is the amount a string in the form and a number in the list?**
    The input lets the user type anything. The saved record must be a real positive number so the totals can add it. Validation is the step that converts one to the other.

20. **Why can the same title appear twice?**
    Titles are labels, not ids. Two grocery trips can share a title. The id tells them apart.

21. **How is the id created?**
    `createId` uses `crypto.randomUUID()` when it exists. The fallback is a string made from the time and a random part. Edit does not replace the id.

22. **What does Cancel do on delete?**
    It closes the dialog and leaves the array unchanged. The row is removed only after **Delete transaction**.

## Calculations

23. **How is total income calculated?**
    Sum the `amount` of every row whose `type` is `income`. Expenses are not included.

24. **How is total expenses calculated?**
    Sum the `amount` of every row whose `type` is `expense`.

25. **What is net balance?**
    Total income minus total expenses. It can be negative. The card then says **Deficit**. A positive result says **Surplus**. Zero says **Even**.

26. **Why are amounts stored as positive numbers?**
    The sign is not hidden inside the number. The type says whether the amount is income or an expense, so a negative expense cannot be confused with income.

27. **Why add in paise?**
    Binary floating point can make `0.1 + 0.2` slightly off. `sumAmounts` rounds each amount to paise, adds those integers, and divides by 100.

28. **Does the category chart include salary?**
    No. `getExpenseTotalsByCategory` skips income. The heading on the dashboard says expenses only.

29. **Do filters change the dashboard cards?**
    No. The dashboard passes the full list to `getSummary`. The Transactions page calculates a second summary labelled “Matching”. A test searches for “milk” and then checks that the dashboard still shows the full income and expenses.

30. **What are the demo totals?**
    Income ₹48,500, expenses ₹14,950, net ₹33,550. Food is ₹2,640 because groceries (₹1,860) and dinner (₹780) are both Food.

## LocalStorage

31. **Where is the data saved?**
    In `localStorage` under the key `expense-tracker.transactions.v1`, as a JSON array.

32. **When is the demo list created?**
    Only when that key is missing. `loadTransactions` then saves the demo list. A later refresh reads the saved array and does not create a second copy.

33. **What if the user deletes every row?**
    The app saves `[]`. On the next visit the key exists, so the demo list is not created again. An empty list is a real saved state.

34. **What if the stored JSON is broken?**
    `JSON.parse` is in a try/catch. The page shows a warning and an empty list. The broken text stays in storage until the user successfully saves a new list.

35. **What if one object in the array is invalid?**
    That object is skipped and counted in a warning. Valid rows still show. The raw stored text is left as it was until the next successful save.

36. **Will a refresh keep a new transaction?**
    Yes, after a successful `setItem`. Add, edit, delete, and reset all save the whole list before they treat the action as done. If `setItem` throws, the previous React state stays and an error banner appears.

37. **Does Vercel store the transactions?**
    No. Vercel stores the HTML, CSS, and JavaScript. `localStorage` is on the visitor’s browser. Another laptop, another browser, or a private window has its own storage.

38. **Can clearing browser data delete the records?**
    Yes. The app cannot recover them. The About page says this.

39. **Is this safe for bank passwords?**
    No. There is no encryption and no login. Anyone using this browser profile can read the list. The project is a personal notebook for amounts, titles, and notes.

## Layout and deployment

40. **How does the layout change on a phone?**
    Below 1024px the sidebar is hidden and a three-button bar is shown. Below 768px the three summary cards stack. Transaction rows stack instead of squeezing into one wide line.

41. **How is income different from expense if color is hard to see?**
    Each row prints the word Income or Expense, shows an up or down icon, and puts a plus or minus before the amount. The cards also say “Money received” and “Money spent”.

42. **Why is there no `vercel.json`?**
    The app does not use client-side routes. Every screen is the same URL, so the host does not need a fallback rewrite.

43. **What are the Vercel build settings?**
    Build command `npm run build`. Output directory `dist`. No environment variables.

44. **What should you click during the demo?**
    Show the three totals, add a small expense, show the validation error for amount `0`, edit a row, delete one after confirming, search `milk`, then refresh and show that the new row is still there.

45. **Which file should you open if the examiner asks about the formulas?**
    `src/utils/calculations.ts`. For saving rules, open `src/services/storage.ts`. For the form rules, open `src/utils/validation.ts`.
