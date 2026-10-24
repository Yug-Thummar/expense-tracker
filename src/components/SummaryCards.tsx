import { Scale, TrendingDown, TrendingUp } from 'lucide-react'
import type { Summary } from '../utils/calculations.ts'
import { balanceLabel } from '../utils/calculations.ts'
import { formatINR } from '../utils/money.ts'

type SummaryCardsProps = {
  summary: Summary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Income',
      value: summary.totalIncome,
      hint: 'Money received',
      icon: TrendingUp,
      iconClass: 'bg-soft text-accent',
      valueClass: 'text-accent',
    },
    {
      label: 'Total Expenses',
      value: summary.totalExpenses,
      hint: 'Money spent',
      icon: TrendingDown,
      iconClass: 'bg-clay-soft text-clay',
      valueClass: 'text-clay',
    },
    {
      label: 'Net Balance',
      value: summary.netBalance,
      hint: balanceLabel(summary.netBalance),
      icon: Scale,
      iconClass: 'bg-canvas text-ink',
      valueClass: summary.netBalance < 0 ? 'text-clay' : summary.netBalance > 0 ? 'text-accent' : 'text-ink',
    },
  ]

  return (
    <section>
      <h2 className="sr-only">Summary</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-muted">{card.label}</h3>
                  <p className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums [overflow-wrap:anywhere] ${card.valueClass}`}>
                    {formatINR(card.value)}
                  </p>
                  <p className="mt-2 text-sm text-ink">{card.hint}</p>
                </div>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}>
                  <Icon aria-hidden="true" size={20} />
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
