import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TransactionFilterBar } from '../components/TransactionFilterBar.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { TransactionList } from '../components/TransactionList.tsx'
import type { Transaction, TransactionFilters } from '../types/transaction.ts'
import { primaryButtonClass, secondaryButtonClass } from '../ui.ts'
import { balanceWord, getSummary, sortTransactions } from '../utils/calculations.ts'
import { EMPTY_FILTERS, filterTransactions } from '../utils/filters.ts'
import { formatINR } from '../utils/money.ts'

type TransactionsViewProps = {
  transactions: Transaction[]
  onAdd: () => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionsView({ transactions, onAdd, onEdit, onDelete }: TransactionsViewProps) {
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS)
  const filtered = sortTransactions(filterTransactions(transactions, filters))
  const matching = getSummary(filtered)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Add, edit, search, and filter records. Dashboard totals still use every saved transaction."
        action={
          <button type="button" onClick={onAdd} className={`${primaryButtonClass} w-full sm:w-auto`}>
            <Plus aria-hidden="true" size={16} />
            Add transaction
          </button>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          message="Add a record, or restore the demo set from the About page."
          action={
            <button type="button" onClick={onAdd} className={primaryButtonClass}>
              <Plus aria-hidden="true" size={16} />
              Add transaction
            </button>
          }
        />
      ) : (
        <>
          <TransactionFilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
          <section className="rounded-2xl border border-line bg-white p-4 shadow-card" aria-label="Matching records">
            <p className="text-sm text-muted">
              Showing {filtered.length} of {transactions.length} saved{' '}
              {transactions.length === 1 ? 'transaction' : 'transactions'}.
            </p>
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-muted">Matching income</dt>
                <dd className="mt-1 font-semibold tabular-nums text-accent">{formatINR(matching.totalIncome)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Matching expenses</dt>
                <dd className="mt-1 font-semibold tabular-nums text-clay">{formatINR(matching.totalExpenses)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Matching net</dt>
                <dd className="mt-1 font-semibold tabular-nums text-ink">
                  {formatINR(matching.netBalance)}
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    {balanceWord(matching.netBalance)}
                  </span>
                </dd>
              </div>
            </dl>
          </section>
          {filtered.length === 0 ? (
            <EmptyState
              title="No matching transactions"
              message="Nothing in the saved list matches this search or filter."
              action={
                <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={secondaryButtonClass}>
                  Clear filters
                </button>
              }
            />
          ) : (
            <TransactionList transactions={filtered} onEdit={onEdit} onDelete={onDelete} />
          )}
        </>
      )}
    </div>
  )
}
