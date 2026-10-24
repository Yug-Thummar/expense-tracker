import { Plus } from 'lucide-react'
import type { Transaction } from '../types/transaction.ts'
import { getSummary, sortTransactions } from '../utils/calculations.ts'
import { primaryButtonClass, secondaryButtonClass } from '../ui.ts'
import { CategoryBreakdown } from '../components/CategoryBreakdown.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { SummaryCards } from '../components/SummaryCards.tsx'
import { TransactionList } from '../components/TransactionList.tsx'

type DashboardViewProps = {
  transactions: Transaction[]
  onAdd: () => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  onViewAll: () => void
}

export function DashboardView({ transactions, onAdd, onEdit, onDelete, onViewAll }: DashboardViewProps) {
  const summary = getSummary(transactions)
  const recent = sortTransactions(transactions).slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Income, expenses, and balance are calculated from every transaction saved in this browser."
        action={
          <button type="button" onClick={onAdd} className={`${primaryButtonClass} w-full sm:w-auto`}>
            <Plus aria-hidden="true" size={16} />
            Add transaction
          </button>
        }
      />
      <SummaryCards summary={summary} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="min-w-0 xl:col-span-3">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent transactions</h2>
              <p className="text-sm text-muted">Up to five latest records.</p>
            </div>
            <button type="button" onClick={onViewAll} className={secondaryButtonClass}>
              View all
            </button>
          </div>
          <TransactionList transactions={recent} onEdit={onEdit} onDelete={onDelete} />
        </section>
        <section className="min-w-0 xl:col-span-2">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">Spending by category</h2>
            <p className="text-sm text-muted">Expenses only. Income is not included.</p>
          </div>
          <CategoryBreakdown transactions={transactions} />
        </section>
      </div>
    </div>
  )
}
