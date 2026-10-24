import { Pencil, Trash, TrendingDown, TrendingUp } from 'lucide-react'
import type { Transaction } from '../types/transaction.ts'
import { formatDisplayDate } from '../utils/dates.ts'
import { formatINR } from '../utils/money.ts'
import { dangerQuietButtonClass, quietButtonClass } from '../ui.ts'
import { EmptyState } from './EmptyState.tsx'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  emptyTitle?: string
  emptyMessage?: string
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  emptyTitle = 'No transactions yet',
  emptyMessage = 'Add a transaction to start the list. You can also restore the demo set from the About page.',
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <ul className="space-y-3">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'income'
        const actionName = `${transaction.title}, ${formatDisplayDate(transaction.date)}, ${formatINR(transaction.amount)}`

        return (
          <li key={transaction.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words font-semibold text-ink">{transaction.title}</p>
                {transaction.note && <p className="mt-1 break-words text-sm text-muted">{transaction.note}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-canvas px-2.5 py-1 font-medium text-ink">{transaction.category}</span>
                  <span className="text-muted">{formatDisplayDate(transaction.date)}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="text-left sm:text-right">
                  <p className={`text-base font-semibold tabular-nums ${isIncome ? 'text-accent' : 'text-clay'}`}>
                    <span aria-hidden="true">{isIncome ? '+' : '−'}</span>
                    {formatINR(transaction.amount)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {isIncome ? (
                      <TrendingUp aria-hidden="true" size={14} />
                    ) : (
                      <TrendingDown aria-hidden="true" size={14} />
                    )}
                    {isIncome ? 'Income' : 'Expense'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={quietButtonClass}
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit ${actionName}`}
                  >
                    <Pencil aria-hidden="true" size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    className={dangerQuietButtonClass}
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete ${actionName}`}
                  >
                    <Trash aria-hidden="true" size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
