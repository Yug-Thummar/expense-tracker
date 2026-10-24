import type { Transaction, TransactionType } from '../types/transaction.ts'
import { daysAgo, midPreviousMonth, todayISO } from '../utils/dates.ts'
import { createId } from '../utils/id.ts'

type DemoSpec = {
  title: string
  amount: number
  type: TransactionType
  category: string
  date: () => string
  note: string
}

/**
 * Dates are created when the demo is saved, not hardcoded.
 * Movie night is always placed in the previous month so the month filter has a contrast.
 * Update the expected totals in calculations.test.ts if these amounts change.
 */
const DEMO_SPECS: DemoSpec[] = [
  {
    title: 'Monthly salary',
    amount: 42000,
    type: 'income',
    category: 'Salary',
    date: todayISO,
    note: 'Monthly stipend',
  },
  {
    title: 'Weekend freelance',
    amount: 6500,
    type: 'income',
    category: 'Freelance',
    date: () => daysAgo(1),
    note: 'Poster design',
  },
  {
    title: 'Room rent',
    amount: 10000,
    type: 'expense',
    category: 'Rent',
    date: () => daysAgo(2),
    note: 'Shared apartment',
  },
  {
    title: 'Groceries',
    amount: 1860,
    type: 'expense',
    category: 'Food',
    date: () => daysAgo(3),
    note: 'Vegetables and milk',
  },
  {
    title: 'Metro pass',
    amount: 450,
    type: 'expense',
    category: 'Transport',
    date: () => daysAgo(4),
    note: '',
  },
  {
    title: 'Electricity bill',
    amount: 1240,
    type: 'expense',
    category: 'Utilities',
    date: () => daysAgo(5),
    note: 'Room share',
  },
  {
    title: 'Dinner with friends',
    amount: 780,
    type: 'expense',
    category: 'Food',
    date: () => daysAgo(6),
    note: 'Campus cafe',
  },
  {
    title: 'Movie night',
    amount: 620,
    type: 'expense',
    category: 'Entertainment',
    date: midPreviousMonth,
    note: 'Tickets with friends',
  },
]

export function createDemoTransactions(): Transaction[] {
  const createdAtBase = Date.now()

  return DEMO_SPECS.map((spec, index) => ({
    id: createId(),
    title: spec.title,
    amount: spec.amount,
    type: spec.type,
    category: spec.category,
    date: spec.date(),
    note: spec.note,
    createdAt: new Date(createdAtBase - index * 1000).toISOString(),
  }))
}
