import { useEffect, useState } from 'react'
import { createDemoTransactions } from '../data/demoTransactions.ts'
import { loadTransactions, saveTransactions } from '../services/storage.ts'
import type { Transaction, TransactionInput } from '../types/transaction.ts'
import { createId } from '../utils/id.ts'

const SUCCESS_BANNER_MS = 4000

export type BannerState = {
  tone: 'success' | 'error'
  message: string
}

export function useTransactions() {
  // localStorage is synchronous, so the first render can use the saved list.
  const [snapshot] = useState(() => loadTransactions())
  const [transactions, setTransactions] = useState(snapshot.transactions)
  const [warning, setWarning] = useState<string | null>(snapshot.warning)
  const [banner, setBanner] = useState<BannerState | null>(null)

  useEffect(() => {
    if (!banner || banner.tone !== 'success') return

    const timeoutId = window.setTimeout(() => setBanner(null), SUCCESS_BANNER_MS)
    return () => window.clearTimeout(timeoutId)
  }, [banner])

  function persist(next: Transaction[], successMessage: string): boolean {
    const saved = saveTransactions(next)
    if (!saved.ok) {
      setBanner({ tone: 'error', message: saved.message })
      return false
    }

    setTransactions(next)
    setWarning(null)
    setBanner({ tone: 'success', message: successMessage })
    return true
  }

  function addTransaction(input: TransactionInput): boolean {
    const transaction: Transaction = {
      ...input,
      id: createId(),
      createdAt: new Date().toISOString(),
    }

    return persist([transaction, ...transactions], 'Transaction added.')
  }

  function updateTransaction(id: string, input: TransactionInput): boolean {
    const exists = transactions.some((transaction) => transaction.id === id)
    if (!exists) {
      setBanner({ tone: 'error', message: 'That transaction could not be found.' })
      return false
    }

    const next = transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, ...input } : transaction,
    )
    return persist(next, 'Transaction updated.')
  }

  function deleteTransaction(id: string): boolean {
    const exists = transactions.some((transaction) => transaction.id === id)
    if (!exists) {
      setBanner({ tone: 'error', message: 'That transaction could not be found.' })
      return false
    }

    const next = transactions.filter((transaction) => transaction.id !== id)
    return persist(next, 'Transaction deleted.')
  }

  function resetDemoData(): boolean {
    return persist(createDemoTransactions(), 'Demo data restored.')
  }

  function dismissBanner(): void {
    setBanner(null)
  }

  function dismissWarning(): void {
    setWarning(null)
  }

  return {
    transactions,
    warning,
    banner,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetDemoData,
    dismissBanner,
    dismissWarning,
  }
}
