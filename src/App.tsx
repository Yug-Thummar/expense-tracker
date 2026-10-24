import { useEffect, useState } from 'react'
import { AppShell, type AppView } from './components/AppShell.tsx'
import { Banner, StorageWarning } from './components/Feedback.tsx'
import { ConfirmDialog } from './components/ConfirmDialog.tsx'
import { TransactionFormDialog } from './components/TransactionFormDialog.tsx'
import { useTransactions } from './hooks/useTransactions.ts'
import type { Transaction, TransactionInput } from './types/transaction.ts'
import { AboutView } from './views/AboutView.tsx'
import { DashboardView } from './views/DashboardView.tsx'
import { TransactionsView } from './views/TransactionsView.tsx'

export default function App() {
  const ledger = useTransactions()
  const [view, setView] = useState<AppView>('dashboard')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  useEffect(() => {
    const titles: Record<AppView, string> = {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      about: 'About',
    }
    document.title = `${titles[view]} · Expense Tracker`
  }, [view])

  function openCreate() {
    setEditing(null)
    setCreating(true)
  }

  function openEdit(transaction: Transaction) {
    setCreating(false)
    setEditing(transaction)
  }

  function closeForm() {
    setCreating(false)
    setEditing(null)
  }

  function handleSubmit(input: TransactionInput) {
    const saved = editing ? ledger.updateTransaction(editing.id, input) : ledger.addTransaction(input)
    if (saved) closeForm()
  }

  return (
    <>
      <AppShell view={view} onViewChange={setView}>
        <div className="space-y-6">
          {ledger.warning && <StorageWarning message={ledger.warning} onDismiss={ledger.dismissWarning} />}
          {view === 'dashboard' && (
            <DashboardView
              transactions={ledger.transactions}
              onAdd={openCreate}
              onEdit={openEdit}
              onDelete={setPendingDelete}
              onViewAll={() => setView('transactions')}
            />
          )}
          {view === 'transactions' && (
            <TransactionsView
              transactions={ledger.transactions}
              onAdd={openCreate}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          )}
          {view === 'about' && <AboutView onReset={ledger.resetDemoData} />}
        </div>
      </AppShell>

      {(creating || editing) && (
        <TransactionFormDialog
          key={editing ? editing.id : 'create'}
          mode={editing ? 'edit' : 'create'}
          initial={editing}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this transaction?"
          message={`Delete "${pendingDelete.title}"? This removes it from this browser.`}
          confirmLabel="Delete transaction"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            const saved = ledger.deleteTransaction(pendingDelete.id)
            if (saved) setPendingDelete(null)
          }}
        />
      )}

      {ledger.banner && <Banner banner={ledger.banner} onDismiss={ledger.dismissBanner} />}
    </>
  )
}
