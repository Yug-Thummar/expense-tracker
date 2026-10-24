import { useState, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { dangerButtonClass } from '../ui.ts'

type AboutViewProps = {
  onReset: () => boolean
}

export function AboutView({ onReset }: AboutViewProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="About"
        description="A small college project for tracking personal income and expenses in the browser."
      />

      <InfoBlock title="What this is">
        <p>
          Expense Tracker is a personal notebook for money coming in and money going out. It is a mini project for
          learning React, not a bank app, accounting system, or production finance product.
        </p>
      </InfoBlock>

      <InfoBlock title="Where your data is stored">
        <p>
          Transactions are saved in this browser's localStorage, on this device and in this browser profile. They are
          not sent to a server, and they are not shared with other people, browsers, or phones.
        </p>
        <p>
          Hosting the app on Vercel only publishes the website files. It does not copy your records to the cloud. If
          you clear site data, use a private window, or switch browsers, these records will not be there.
        </p>
        <p>
          Technical detail: the list is stored under the key <code className="rounded bg-canvas px-1 py-0.5">expense-tracker.transactions.v1</code>.
        </p>
      </InfoBlock>

      <InfoBlock title="How the numbers work">
        <p>Each amount is stored as a positive number. The type decides whether it is income or an expense.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Total income is the sum of income amounts.</li>
          <li>Total expenses is the sum of expense amounts.</li>
          <li>Net balance is total income minus total expenses.</li>
          <li>Category spending adds up expenses only.</li>
        </ul>
        <p>
          The dashboard always uses every saved transaction. Search, type, category, and month filters change only the
          Transactions list and its matching totals.
        </p>
      </InfoBlock>

      <InfoBlock title="How to use it">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Read the dashboard totals.</li>
          <li>Add a transaction with a title, amount, type, category, and date. A note is optional.</li>
          <li>Search or filter from the Transactions page.</li>
          <li>Edit a record, or delete it after confirming.</li>
          <li>Reset the demo data below if you want the sample list back.</li>
        </ol>
      </InfoBlock>

      <InfoBlock title="Demo data">
        <p>
          The first time you open the app in a browser, a small demo set is saved so there is something to explore.
          Dates are based on that first visit, and one sample expense is placed in the previous month. If you already
          have saved records, opening the app again does not replace them.
        </p>
        <p>Resetting deletes the current list in this browser and writes a fresh demo set. You will be asked to confirm.</p>
        <button type="button" onClick={() => setConfirming(true)} className={dangerButtonClass}>
          <RotateCcw aria-hidden="true" size={16} />
          Reset demo data
        </button>
      </InfoBlock>

      <InfoBlock title="Please keep this in mind">
        <ul className="list-disc space-y-1 pl-5">
          <li>Do not store bank passwords, card numbers, or OTPs here.</li>
          <li>Anyone who can use this browser profile can see the records.</li>
          <li>The app does not connect to a bank or check that a balance is real.</li>
          <li>There is no login, and there is no way to recover records after site data is cleared.</li>
        </ul>
      </InfoBlock>

      {confirming && (
        <ConfirmDialog
          title="Replace the current list?"
          message="This removes every saved transaction in this browser and writes the demo set again. It cannot be undone."
          confirmLabel="Replace with demo data"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            const saved = onReset()
            if (saved) setConfirming(false)
          }}
        />
      )}
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-ink">{children}</div>
    </section>
  )
}
