import type { Transaction } from '../types/transaction.ts'
import { sumAmounts, toPaise } from './money.ts'

export type Summary = {
  totalIncome: number
  totalExpenses: number
  netBalance: number
}

export type CategoryTotal = {
  category: string
  total: number
}

/**
 * Totals always come from the list you pass in.
 * The dashboard should pass every saved transaction.
 * Pass a filtered list only for the "matching records" summary.
 */
export function getSummary(transactions: Transaction[]): Summary {
  const totalIncome = sumAmounts(
    transactions.filter((transaction) => transaction.type === 'income').map((transaction) => transaction.amount),
  )
  const totalExpenses = sumAmounts(
    transactions.filter((transaction) => transaction.type === 'expense').map((transaction) => transaction.amount),
  )
  const netBalance = (toPaise(totalIncome) - toPaise(totalExpenses)) / 100

  return { totalIncome, totalExpenses, netBalance }
}

/** Category totals include expenses only. Income is ignored. */
export function getExpenseTotalsByCategory(transactions: Transaction[]): CategoryTotal[] {
  const paiseByCategory = new Map<string, number>()

  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    const current = paiseByCategory.get(transaction.category) ?? 0
    paiseByCategory.set(transaction.category, current + toPaise(transaction.amount))
  }

  return [...paiseByCategory.entries()]
    .map(([category, paise]) => ({ category, total: paise / 100 }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category))
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1
    return a.id < b.id ? 1 : -1
  })
}

export function balanceWord(netBalance: number): 'Surplus' | 'Deficit' | 'Even' {
  if (netBalance > 0) return 'Surplus'
  if (netBalance < 0) return 'Deficit'
  return 'Even'
}

export function balanceLabel(netBalance: number): string {
  const word = balanceWord(netBalance)
  if (word === 'Surplus') return 'Surplus: income is higher'
  if (word === 'Deficit') return 'Deficit: expenses are higher'
  return 'Even: income matches expenses'
}
