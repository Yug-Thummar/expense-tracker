import type { Transaction, TransactionFilters } from '../types/transaction.ts'

export const EMPTY_FILTERS: TransactionFilters = {
  query: '',
  type: 'all',
  category: 'all',
  month: '',
}

export function hasActiveFilters(filters: TransactionFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.month !== ''
  )
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const query = filters.query.trim().toLowerCase()
  const month = /^\d{4}-\d{2}$/.test(filters.month) ? filters.month : ''

  return transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) return false
    if (filters.category !== 'all' && transaction.category !== filters.category) return false
    if (month && !transaction.date.startsWith(`${month}-`)) return false
    if (query === '') return true

    const haystack = `${transaction.title} ${transaction.note}`.toLowerCase()
    return haystack.includes(query)
  })
}
