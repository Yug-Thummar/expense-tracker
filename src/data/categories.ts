import type { TransactionType } from '../types/transaction.ts'

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Other'] as const

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Shopping',
  'Health',
  'Education',
  'Entertainment',
  'Other',
] as const

export function categoriesForType(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function isKnownCategory(type: TransactionType, category: string): boolean {
  return categoriesForType(type).includes(category)
}

/** Categories shown in the filter, narrowed when a type is selected. */
export function categoryOptionsForFilter(type: 'all' | TransactionType): string[] {
  if (type === 'income') return [...INCOME_CATEGORIES]
  if (type === 'expense') return [...EXPENSE_CATEGORIES]
  // Other appears in both lists. Set keeps a single entry.
  return [...new Set<string>([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])]
}
