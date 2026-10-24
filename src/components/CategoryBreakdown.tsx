import type { Transaction } from '../types/transaction.ts'
import { getExpenseTotalsByCategory, getSummary } from '../utils/calculations.ts'
import { formatINR } from '../utils/money.ts'
import { EmptyState } from './EmptyState.tsx'

function formatShare(part: number, whole: number): string {
  if (whole <= 0) return '0%'
  const value = (part / whole) * 100
  if (value > 0 && value < 1) return '<1%'
  return `${Math.round(value)}%`
}

export function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
  const totals = getExpenseTotalsByCategory(transactions)
  const { totalExpenses } = getSummary(transactions)

  if (totals.length === 0) {
    return (
      <EmptyState
        title="No expenses yet"
        message="Category totals appear when you add an expense. Income is not counted here."
      />
    )
  }

  const largest = totals[0]?.total ?? 0

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
      <ul className="space-y-4">
        {totals.map((item) => {
          const width = largest === 0 ? 0 : (item.total / largest) * 100
          const share = formatShare(item.total, totalExpenses)

          return (
            <li key={item.category}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-ink">{item.category}</span>
                <span className="shrink-0 tabular-nums text-ink">
                  {formatINR(item.total)}
                  <span className="text-muted"> · {share}</span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas" aria-hidden="true">
                <div className="h-2 rounded-full bg-clay" style={{ width: `${width}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs leading-5 text-muted">
        Bar length compares categories with each other. The percentage is each category's share of total expenses.
      </p>
    </div>
  )
}
