export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
  note: string
  createdAt: string
}

/** Fields ready to store, before an id and createdAt are attached. */
export type TransactionInput = {
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
  note: string
}

/** Raw form values. Amount stays a string until validation. */
export type TransactionDraft = {
  title: string
  amount: string
  type: TransactionType | ''
  category: string
  date: string
  note: string
}

export type TransactionFilters = {
  query: string
  type: 'all' | TransactionType
  category: string
  month: string
}
