import { isKnownCategory } from '../data/categories.ts'
import type { Transaction, TransactionDraft, TransactionInput } from '../types/transaction.ts'
import { isValidIsoDate, todayISO } from './dates.ts'
import { MAX_AMOUNT } from './money.ts'

const AMOUNT_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/

export type TransactionField = keyof TransactionDraft

export type FieldErrors = Partial<Record<TransactionField, string>>

export type ValidationResult =
  | { ok: true; value: TransactionInput }
  | { ok: false; errors: FieldErrors }

const AMOUNT_HELP = 'Enter an amount greater than 0, with up to 2 decimal places and no commas.'

export function blankDraft(): TransactionDraft {
  return {
    title: '',
    amount: '',
    type: '',
    category: '',
    date: todayISO(),
    note: '',
  }
}

export function draftFromTransaction(transaction: Transaction): TransactionDraft {
  return {
    title: transaction.title,
    amount: transaction.amount.toFixed(2),
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note,
  }
}

export function validateTransaction(draft: TransactionDraft): ValidationResult {
  const errors: FieldErrors = {}
  const title = draft.title.trim()
  const note = draft.note.trim()
  const amount = parseAmount(draft.amount)

  if (title.length === 0) {
    errors.title = 'Enter a title.'
  } else if (title.length > 60) {
    errors.title = 'Keep the title within 60 characters.'
  }

  if (amount === null) {
    errors.amount = amountError(draft.amount)
  }

  if (draft.type !== 'income' && draft.type !== 'expense') {
    errors.type = 'Choose income or expense.'
  }

  if (draft.category.trim().length === 0) {
    errors.category = 'Choose a category.'
  } else if (
    (draft.type === 'income' || draft.type === 'expense') &&
    !isKnownCategory(draft.type, draft.category)
  ) {
    errors.category = 'Choose a category from the list.'
  }

  if (draft.date.trim().length === 0) {
    errors.date = 'Enter a date.'
  } else if (!isValidIsoDate(draft.date)) {
    errors.date = 'Enter a valid date between 2000 and 2100.'
  }

  if (note.length > 200) {
    errors.note = 'Keep the note within 200 characters.'
  }

  if (Object.values(errors).some((message) => Boolean(message))) {
    return { ok: false, errors }
  }

  if (amount === null || (draft.type !== 'income' && draft.type !== 'expense')) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: {
      title,
      amount,
      type: draft.type,
      category: draft.category,
      date: draft.date,
      note,
    },
  }
}

function parseAmount(raw: string): number | null {
  const amountText = raw.trim()
  if (!AMOUNT_PATTERN.test(amountText)) return null

  const amount = Number(amountText)
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return null
  return amount
}

function amountError(raw: string): string {
  const amountText = raw.trim()
  if (!AMOUNT_PATTERN.test(amountText)) return AMOUNT_HELP

  const amount = Number(amountText)
  if (Number.isFinite(amount) && amount > MAX_AMOUNT) {
    return 'Enter an amount of ₹10,00,00,000 or less.'
  }

  return AMOUNT_HELP
}
