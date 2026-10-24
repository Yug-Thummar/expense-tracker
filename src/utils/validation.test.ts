import { describe, expect, it } from 'vitest'
import { validateTransaction } from './validation.ts'

describe('validateTransaction', () => {
  it('accepts a trimmed income or expense with a positive amount', () => {
    const result = validateTransaction({
      title: '  Bus fare  ',
      amount: '15.50',
      type: 'expense',
      category: 'Transport',
      date: '2026-10-24',
      note: '  evening  ',
    })

    expect(result).toEqual({
      ok: true,
      value: {
        title: 'Bus fare',
        amount: 15.5,
        type: 'expense',
        category: 'Transport',
        date: '2026-10-24',
        note: 'evening',
      },
    })
  })

  it('rejects an empty form except for the prefilled date', () => {
    const result = validateTransaction({
      title: '   ',
      amount: '',
      type: '',
      category: '',
      date: '2026-10-24',
      note: '',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.title).toBe('Enter a title.')
      expect(result.errors.amount).toMatch(/greater than 0/)
      expect(result.errors.type).toBe('Choose income or expense.')
      expect(result.errors.category).toBe('Choose a category.')
      expect(result.errors.date).toBeUndefined()
    }
  })

  it('rejects zero, negative, non-numeric, and over-precise amounts', () => {
    for (const amount of ['0', '0.00', '-5', 'abc', '10.555', '1,000', '1e2']) {
      const result = validateTransaction({
        title: 'Test',
        amount,
        type: 'expense',
        category: 'Food',
        date: '2026-10-24',
        note: '',
      })
      expect(result.ok, amount).toBe(false)
      if (!result.ok) expect(result.errors.amount, amount).toMatch(/greater than 0/)
    }
  })

  it('rejects an amount above the limit', () => {
    const result = validateTransaction({
      title: 'Test',
      amount: '100000000.01',
      type: 'income',
      category: 'Salary',
      date: '2026-10-24',
      note: '',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.amount).toMatch(/10,00,00,000/)
  })

  it('rejects an unknown category for the chosen type', () => {
    const result = validateTransaction({
      title: 'Test',
      amount: '10',
      type: 'expense',
      category: 'Salary',
      date: '2026-10-24',
      note: '',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.category).toBe('Choose a category from the list.')
  })

  it('rejects impossible and out-of-range dates', () => {
    for (const date of ['2026-02-31', '1999-01-01', '24-10-2026', '2026-13-01']) {
      const result = validateTransaction({
        title: 'Test',
        amount: '10',
        type: 'income',
        category: 'Gift',
        date,
        note: '',
      })
      expect(result.ok, date).toBe(false)
      if (!result.ok) expect(result.errors.date, date).toMatch(/valid date/)
    }
  })

  it('rejects a title or note that is too long', () => {
    const result = validateTransaction({
      title: 'a'.repeat(61),
      amount: '10',
      type: 'income',
      category: 'Gift',
      date: '2026-10-24',
      note: 'b'.repeat(201),
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.title).toMatch(/60/)
      expect(result.errors.note).toMatch(/200/)
    }
  })
})
