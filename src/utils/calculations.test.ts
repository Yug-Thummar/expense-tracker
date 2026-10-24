import { describe, expect, it } from 'vitest'
import { createDemoTransactions } from '../data/demoTransactions.ts'
import type { Transaction } from '../types/transaction.ts'
import {
  balanceWord,
  getExpenseTotalsByCategory,
  getSummary,
  sortTransactions,
} from './calculations.ts'
import { sumAmounts, formatINR } from './money.ts'

function makeTransaction(overrides: Partial<Transaction> & Pick<Transaction, 'id' | 'amount' | 'type'>): Transaction {
  return {
    title: 'Sample',
    category: overrides.type === 'income' ? 'Salary' : 'Food',
    date: '2026-10-01',
    note: '',
    createdAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('getSummary', () => {
  it('sums income and expenses separately and subtracts for the balance', () => {
    const summary = getSummary([
      makeTransaction({ id: 'in', amount: 100, type: 'income' }),
      makeTransaction({ id: 'food', amount: 40, type: 'expense' }),
      makeTransaction({ id: 'rent', amount: 25.5, type: 'expense', category: 'Rent' }),
    ])

    expect(summary).toEqual({
      totalIncome: 100,
      totalExpenses: 65.5,
      netBalance: 34.5,
    })
  })

  it('returns zeros for an empty list', () => {
    expect(getSummary([])).toEqual({
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
    })
    expect(balanceWord(0)).toBe('Even')
  })

  it('labels a deficit when expenses are higher', () => {
    const summary = getSummary([
      makeTransaction({ id: 'in', amount: 100, type: 'income' }),
      makeTransaction({ id: 'out', amount: 250, type: 'expense' }),
    ])

    expect(summary.netBalance).toBe(-150)
    expect(balanceWord(summary.netBalance)).toBe('Deficit')
    expect(balanceWord(10)).toBe('Surplus')
  })

  it('adds paise so decimal amounts do not drift', () => {
    expect(sumAmounts([10.1, 10.2])).toBe(20.3)
    expect(
      getSummary([
        makeTransaction({ id: 'a', amount: 10.1, type: 'expense' }),
        makeTransaction({ id: 'b', amount: 10.2, type: 'expense' }),
      ]).totalExpenses,
    ).toBe(20.3)
  })

  it('updates totals when a record is edited or removed', () => {
    const original = [
      makeTransaction({ id: '1', amount: 100, type: 'income' }),
      makeTransaction({ id: '2', amount: 40, type: 'expense', category: 'Food' }),
    ]
    const edited = original.map((transaction) =>
      transaction.id === '2' ? { ...transaction, amount: 10, category: 'Rent' } : transaction,
    )
    const deleted = original.filter((transaction) => transaction.id !== '1')

    expect(getSummary(edited).totalExpenses).toBe(10)
    expect(getExpenseTotalsByCategory(edited)).toEqual([{ category: 'Rent', total: 10 }])
    expect(getSummary(deleted)).toEqual({
      totalIncome: 0,
      totalExpenses: 40,
      netBalance: -40,
    })
  })
})

describe('getExpenseTotalsByCategory', () => {
  it('ignores income and combines expenses in the same category', () => {
    const totals = getExpenseTotalsByCategory([
      makeTransaction({ id: 'pay', amount: 500, type: 'income', category: 'Salary' }),
      makeTransaction({ id: 'food-1', amount: 40, type: 'expense', category: 'Food' }),
      makeTransaction({ id: 'food-2', amount: 10.5, type: 'expense', category: 'Food' }),
      makeTransaction({ id: 'rent', amount: 20, type: 'expense', category: 'Rent' }),
    ])

    expect(totals).toEqual([
      { category: 'Food', total: 50.5 },
      { category: 'Rent', total: 20 },
    ])
  })
})

describe('sortTransactions', () => {
  it('orders newer dates first without changing the original array', () => {
    const older = makeTransaction({
      id: 'old',
      amount: 10,
      type: 'expense',
      date: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const newer = makeTransaction({
      id: 'new',
      amount: 10,
      type: 'expense',
      date: '2026-02-01',
      createdAt: '2026-02-01T00:00:00.000Z',
    })
    const sameDayLater = makeTransaction({
      id: 'later',
      amount: 10,
      type: 'expense',
      date: '2026-02-01',
      createdAt: '2026-02-01T05:00:00.000Z',
    })
    const original = [older, newer]

    expect(sortTransactions(original).map((transaction) => transaction.id)).toEqual(['new', 'old'])
    expect(sortTransactions([older, sameDayLater, newer]).map((transaction) => transaction.id)).toEqual([
      'later',
      'new',
      'old',
    ])
    expect(original.map((transaction) => transaction.id)).toEqual(['old', 'new'])
  })
})

describe('demo totals', () => {
  it('matches the sample amounts used in the app', () => {
    const summary = getSummary(createDemoTransactions())
    expect(summary).toEqual({
      totalIncome: 48500,
      totalExpenses: 14950,
      netBalance: 33550,
    })
    expect(getExpenseTotalsByCategory(createDemoTransactions()).find((item) => item.category === 'Salary')).toBeUndefined()
    expect(getExpenseTotalsByCategory(createDemoTransactions()).find((item) => item.category === 'Food')?.total).toBe(2640)
  })
})

describe('formatINR', () => {
  it('uses the rupee symbol and Indian grouping', () => {
    const formatted = formatINR(48500).replace(/[\u00a0\u202f]/g, ' ')
    expect(formatted).toContain('₹')
    expect(formatted).toContain('48,500')
  })
})
