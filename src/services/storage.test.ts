import { describe, expect, it } from 'vitest'
import { createDemoTransactions } from '../data/demoTransactions.ts'
import { loadTransactions, saveTransactions, STORAGE_KEY, type KeyValueStorage } from './storage.ts'

class MemoryStorage implements KeyValueStorage {
  private items = new Map<string, string>()

  getItem(key: string): string | null {
    const value = this.items.get(key)
    return value === undefined ? null : value
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value)
  }
}

describe('loadTransactions', () => {
  it('seeds demo data only when the key is missing', () => {
    const storage = new MemoryStorage()
    const first = loadTransactions(storage)
    const saved = storage.getItem(STORAGE_KEY)

    expect(first.seeded).toBe(true)
    expect(first.warning).toBeNull()
    expect(first.transactions).toHaveLength(createDemoTransactions().length)
    expect(saved).not.toBeNull()

    const second = loadTransactions(storage)
    expect(second.seeded).toBe(false)
    expect(second.transactions.map((item) => item.id)).toEqual(first.transactions.map((item) => item.id))
    expect(storage.getItem(STORAGE_KEY)).toBe(saved)
  })

  it('keeps an empty list instead of seeding again', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, '[]')

    const result = loadTransactions(storage)

    expect(result.seeded).toBe(false)
    expect(result.transactions).toEqual([])
    expect(result.warning).toBeNull()
    expect(storage.getItem(STORAGE_KEY)).toBe('[]')
  })

  it('does not overwrite malformed JSON', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, '{bad')

    const result = loadTransactions(storage)

    expect(result.transactions).toEqual([])
    expect(result.seeded).toBe(false)
    expect(result.warning).toMatch(/could not be read/i)
    expect(storage.getItem(STORAGE_KEY)).toBe('{bad')
  })

  it('does not overwrite a value that is not a list', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ hello: 1 }))

    const result = loadTransactions(storage)

    expect(result.transactions).toEqual([])
    expect(result.warning).toMatch(/not a list/i)
    expect(storage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ hello: 1 }))
  })

  it('skips invalid records and leaves storage unchanged', () => {
    const storage = new MemoryStorage()
    const valid = createDemoTransactions()[0]
    expect(valid).toBeDefined()
    if (!valid) return

    const raw = JSON.stringify([
      valid,
      { ...valid, id: 'duplicate' },
      { ...valid },
      { nope: true },
      { ...valid, id: 'negative', amount: -5 },
      { ...valid, id: 'text-amount', amount: '10' },
    ])
    storage.setItem(STORAGE_KEY, raw)

    const result = loadTransactions(storage)

    expect(result.transactions.map((item) => item.id)).toEqual([valid.id, 'duplicate'])
    expect(result.skippedCount).toBe(4)
    expect(result.warning).toMatch(/skipped/i)
    expect(storage.getItem(STORAGE_KEY)).toBe(raw)
  })

  it('round-trips a saved list', () => {
    const storage = new MemoryStorage()
    const demo = createDemoTransactions()

    expect(saveTransactions(demo, storage)).toEqual({ ok: true })
    const loaded = loadTransactions(storage)

    expect(loaded.seeded).toBe(false)
    expect(loaded.transactions).toEqual(demo)
  })

  it('reports a blocked read without throwing', () => {
    const storage: KeyValueStorage = {
      getItem() {
        throw new Error('blocked')
      },
      setItem() {
        throw new Error('blocked')
      },
    }

    const result = loadTransactions(storage)
    expect(result.transactions).toEqual([])
    expect(result.warning).toMatch(/blocked/i)
  })

  it('reports a failed save when seeding', () => {
    const storage: KeyValueStorage = {
      getItem() {
        return null
      },
      setItem() {
        throw new Error('quota')
      },
    }

    const result = loadTransactions(storage)
    expect(result.seeded).toBe(true)
    expect(result.transactions.length).toBeGreaterThan(0)
    expect(result.warning).toMatch(/could not save/i)
    expect(saveTransactions(result.transactions, storage).ok).toBe(false)
  })
})
