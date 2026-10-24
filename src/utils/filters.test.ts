import { describe, expect, it } from 'vitest'
import { createDemoTransactions } from '../data/demoTransactions.ts'
import { EMPTY_FILTERS, filterTransactions } from './filters.ts'

describe('filterTransactions', () => {
  const demo = createDemoTransactions()

  it('searches the title and note without matching the category alone', () => {
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, query: 'MILK' }).map((item) => item.title)).toEqual([
      'Groceries',
    ])
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, query: 'poster' }).map((item) => item.title)).toEqual([
      'Weekend freelance',
    ])
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, query: 'Entertainment' })).toHaveLength(0)
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, query: '   ' })).toHaveLength(demo.length)
  })

  it('filters by type and category', () => {
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, type: 'income' })).toHaveLength(2)
    expect(filterTransactions(demo, { ...EMPTY_FILTERS, category: 'Rent' }).map((item) => item.title)).toEqual([
      'Room rent',
    ])
  })

  it('filters by month and keeps the current-month salary while hiding last month movie', () => {
    const salary = demo.find((item) => item.title === 'Monthly salary')
    const movie = demo.find((item) => item.title === 'Movie night')
    expect(salary).toBeDefined()
    expect(movie).toBeDefined()
    if (!salary || !movie) return

    const currentMonth = salary.date.slice(0, 7)
    const filtered = filterTransactions(demo, { ...EMPTY_FILTERS, month: currentMonth })

    expect(movie.date.startsWith(currentMonth)).toBe(false)
    expect(filtered.some((item) => item.id === salary.id)).toBe(true)
    expect(filtered.some((item) => item.id === movie.id)).toBe(false)
  })

  it('does not change the original list', () => {
    const titles = demo.map((item) => item.title)
    filterTransactions(demo, { ...EMPTY_FILTERS, query: 'milk' })
    expect(demo.map((item) => item.title)).toEqual(titles)
  })
})
