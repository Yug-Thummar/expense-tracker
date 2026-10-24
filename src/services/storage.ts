import { isKnownCategory } from '../data/categories.ts'
import { createDemoTransactions } from '../data/demoTransactions.ts'
import type { Transaction } from '../types/transaction.ts'
import { isValidIsoDate } from '../utils/dates.ts'
import { MAX_AMOUNT, toPaise } from '../utils/money.ts'

/** localStorage key. Versioned so a future shape change can use a new key. */
export const STORAGE_KEY = 'expense-tracker.transactions.v1'

const SAVE_ERROR = 'Could not save your changes. Browser storage may be full or blocked.'

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export type LoadResult = {
  transactions: Transaction[]
  warning: string | null
  seeded: boolean
  skippedCount: number
}

export type SaveResult = { ok: true } | { ok: false; message: string }

/**
 * Reads the transaction list.
 * Demo records are written only when this key is missing.
 * An empty list is a real saved state and is not replaced on startup.
 * Malformed JSON is left untouched.
 */
export function loadTransactions(storage: KeyValueStorage = localStorage): LoadResult {
  let raw: string | null

  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return {
      transactions: [],
      warning: 'This browser blocked local storage, so records cannot be saved on this device.',
      seeded: false,
      skippedCount: 0,
    }
  }

  if (raw === null) {
    const transactions = createDemoTransactions()
    const saved = saveTransactions(transactions, storage)
    return {
      transactions,
      warning: saved.ok ? null : saved.message,
      seeded: true,
      skippedCount: 0,
    }
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return {
        transactions: [],
        warning:
          'Saved data was not a list. Nothing was overwritten. Add a transaction or reset demo data from the About page.',
        seeded: false,
        skippedCount: 0,
      }
    }

    const transactions: Transaction[] = []
    const seenIds = new Set<string>()
    let skippedCount = 0

    for (const item of parsed) {
      const transaction = sanitizeTransaction(item)
      if (!transaction || seenIds.has(transaction.id)) {
        skippedCount += 1
        continue
      }
      seenIds.add(transaction.id)
      transactions.push(transaction)
    }

    return {
      transactions,
      warning: skippedCount > 0 ? skippedMessage(skippedCount) : null,
      seeded: false,
      skippedCount,
    }
  } catch {
    return {
      transactions: [],
      warning:
        'Saved data could not be read. Nothing was overwritten. Add a transaction or reset demo data from the About page.',
      seeded: false,
      skippedCount: 0,
    }
  }
}

export function saveTransactions(
  transactions: Transaction[],
  storage: KeyValueStorage = localStorage,
): SaveResult {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    return { ok: true }
  } catch {
    return { ok: false, message: SAVE_ERROR }
  }
}

function skippedMessage(skippedCount: number): string {
  if (skippedCount === 1) {
    return '1 saved record was skipped because it was incomplete or invalid. It remains in storage until you save a change.'
  }

  return `${skippedCount} saved records were skipped because they were incomplete or invalid. They remain in storage until you save a change.`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeTransaction(value: unknown): Transaction | null {
  if (!isRecord(value)) return null

  const { id, title, amount, type, category, date, createdAt } = value
  const note = value.note === undefined ? '' : value.note

  if (typeof id !== 'string' || id.trim() === '' || id.length > 80) return null
  if (typeof title !== 'string' || title.trim() === '' || title.trim().length > 60) return null
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return null
  if (type !== 'income' && type !== 'expense') return null
  if (typeof category !== 'string' || !isKnownCategory(type, category)) return null
  if (typeof date !== 'string' || !isValidIsoDate(date)) return null
  if (typeof note !== 'string' || note.trim().length > 200) return null
  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) return null

  const paise = toPaise(amount)
  if (paise <= 0) return null

  return {
    id,
    title: title.trim(),
    amount: paise / 100,
    type,
    category,
    date,
    note: note.trim(),
    createdAt,
  }
}
