import { Search } from 'lucide-react'
import { categoryOptionsForFilter } from '../data/categories.ts'
import type { TransactionFilters } from '../types/transaction.ts'
import { hasActiveFilters } from '../utils/filters.ts'
import { fieldClass, labelClass, searchFieldClass, secondaryButtonClass } from '../ui.ts'

type TransactionFilterBarProps = {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
  onClear: () => void
}

export function TransactionFilterBar({ filters, onChange, onClear }: TransactionFilterBarProps) {
  const categories = categoryOptionsForFilter(filters.type)

  function changeType(type: TransactionFilters['type']) {
    const nextCategories = categoryOptionsForFilter(type)
    const category =
      filters.category === 'all' || nextCategories.includes(filters.category) ? filters.category : 'all'
    onChange({ ...filters, type, category })
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 xl:col-span-1">
          <label htmlFor="transaction-search" className={labelClass}>
            Search
          </label>
          <div className="relative">
            <Search aria-hidden="true" size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input
              id="transaction-search"
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
              placeholder="Title or note"
              className={searchFieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="transaction-type-filter" className={labelClass}>
            Type
          </label>
          <select
            id="transaction-type-filter"
            value={filters.type}
            onChange={(event) => changeType(event.target.value as TransactionFilters['type'])}
            className={fieldClass}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="transaction-category-filter" className={labelClass}>
            Category
          </label>
          <select
            id="transaction-category-filter"
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
            className={fieldClass}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="transaction-month-filter" className={labelClass}>
            Month
          </label>
          <input
            id="transaction-month-filter"
            type="month"
            value={filters.month}
            onChange={(event) => onChange({ ...filters, month: event.target.value })}
            className={fieldClass}
          />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">Leave the month blank to show every month. Search checks the title and note.</p>
        {hasActiveFilters(filters) && (
          <button type="button" onClick={onClear} className={secondaryButtonClass}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
