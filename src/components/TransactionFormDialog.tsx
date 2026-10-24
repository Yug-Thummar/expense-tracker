import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { categoriesForType, isKnownCategory } from '../data/categories.ts'
import type { Transaction, TransactionInput, TransactionType } from '../types/transaction.ts'
import { errorTextClass, inputClass, labelClass, noteClass, primaryButtonClass, secondaryButtonClass } from '../ui.ts'
import { blankDraft, draftFromTransaction, validateTransaction, type FieldErrors } from '../utils/validation.ts'
import { Dialog } from './Dialog.tsx'

type TransactionFormDialogProps = {
  mode: 'create' | 'edit'
  initial: Transaction | null
  onClose: () => void
  onSubmit: (input: TransactionInput) => void
}

export function TransactionFormDialog({ mode, initial, onClose, onSubmit }: TransactionFormDialogProps) {
  const formId = useId()
  const [draft, setDraft] = useState(() => (initial ? draftFromTransaction(initial) : blankDraft()))
  const [errors, setErrors] = useState<FieldErrors>({})

  const titleId = `${formId}-title`
  const amountId = `${formId}-amount`
  const categoryId = `${formId}-category`
  const dateId = `${formId}-date`
  const noteId = `${formId}-note`
  const categories = draft.type === 'income' || draft.type === 'expense' ? categoriesForType(draft.type) : []
  const hasErrors = Object.values(errors).some((message) => Boolean(message))

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function selectType(type: TransactionType) {
    setDraft((current) => ({
      ...current,
      type,
      category: isKnownCategory(type, current.category) ? current.category : '',
    }))
    setErrors((current) => ({ ...current, type: undefined, category: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateTransaction(draft)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors({})
    onSubmit(result.value)
  }

  return (
    <Dialog
      title={mode === 'create' ? 'Add transaction' : 'Edit transaction'}
      description="Amounts stay positive. Income or expense says which way the money moved."
      onClose={onClose}
    >
      <form noValidate autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
        {hasErrors && (
          <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-sm text-ink">
            Please fix the highlighted fields before saving.
          </p>
        )}

        <Field label="Title" htmlFor={titleId} error={errors.title}>
          <input
            id={titleId}
            data-autofocus
            value={draft.title}
            onChange={(event) => {
              setDraft((current) => ({ ...current, title: event.target.value }))
              clearError('title')
            }}
            className={inputClass(Boolean(errors.title))}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? `${titleId}-error` : undefined}
            aria-required="true"
            maxLength={60}
          />
        </Field>

        <Field
          label="Amount (₹)"
          htmlFor={amountId}
          error={errors.amount}
          hint="Positive number only, for example 1500 or 99.50. Do not use commas."
        >
          <input
            id={amountId}
            inputMode="decimal"
            value={draft.amount}
            onChange={(event) => {
              setDraft((current) => ({ ...current, amount: event.target.value }))
              clearError('amount')
            }}
            placeholder="0.00"
            className={inputClass(Boolean(errors.amount))}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? `${amountId}-error` : `${amountId}-hint`}
            aria-required="true"
          />
        </Field>

        <fieldset>
          <legend className={labelClass}>Type</legend>
          <div className="grid grid-cols-2 gap-2">
            <TypeChoice
              value="income"
              title="Income"
              detail="Money in"
              checked={draft.type === 'income'}
              onSelect={selectType}
              icon={<TrendingUp aria-hidden="true" size={16} />}
            />
            <TypeChoice
              value="expense"
              title="Expense"
              detail="Money out"
              checked={draft.type === 'expense'}
              onSelect={selectType}
              icon={<TrendingDown aria-hidden="true" size={16} />}
            />
          </div>
          {errors.type && <p className={errorTextClass}>{errors.type}</p>}
        </fieldset>

        <Field
          label="Category"
          htmlFor={categoryId}
          error={errors.category}
          hint={draft.type === '' ? 'Choose income or expense first.' : undefined}
        >
          <select
            id={categoryId}
            value={draft.category}
            disabled={draft.type === ''}
            onChange={(event) => {
              setDraft((current) => ({ ...current, category: event.target.value }))
              clearError('category')
            }}
            className={inputClass(Boolean(errors.category))}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? `${categoryId}-error` : draft.type === '' ? `${categoryId}-hint` : undefined
            }
            aria-required="true"
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date" htmlFor={dateId} error={errors.date}>
          <input
            id={dateId}
            type="date"
            value={draft.date}
            onChange={(event) => {
              setDraft((current) => ({ ...current, date: event.target.value }))
              clearError('date')
            }}
            className={inputClass(Boolean(errors.date))}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? `${dateId}-error` : undefined}
            aria-required="true"
          />
        </Field>

        <Field label="Note (optional)" htmlFor={noteId} error={errors.note}>
          <textarea
            id={noteId}
            value={draft.note}
            onChange={(event) => {
              setDraft((current) => ({ ...current, note: event.target.value }))
              clearError('note')
            }}
            className={noteClass(Boolean(errors.note))}
            aria-invalid={Boolean(errors.note)}
            aria-describedby={errors.note ? `${noteId}-error` : undefined}
            maxLength={200}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
          <button type="submit" className={primaryButtonClass}>
            {mode === 'create' ? 'Save transaction' : 'Save changes'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs leading-5 text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className={errorTextClass}>
          {error}
        </p>
      )}
    </div>
  )
}

function TypeChoice({
  value,
  title,
  detail,
  checked,
  onSelect,
  icon,
}: {
  value: TransactionType
  title: string
  detail: string
  checked: boolean
  onSelect: (type: TransactionType) => void
  icon: ReactNode
}) {
  const selectedClass =
    value === 'income' ? 'border-accent bg-soft' : 'border-clay bg-clay-soft'

  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 ${
        checked ? selectedClass : 'border-line bg-white'
      }`}
    >
      <input
        type="radio"
        name="transaction-type"
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="h-4 w-4"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-ink">
          {icon}
          {title}
        </span>
        <span className="block text-xs text-muted">{detail}</span>
      </span>
    </label>
  )
}
