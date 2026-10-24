import { StrictMode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.tsx'
import { createDemoTransactions } from './data/demoTransactions.ts'
import { STORAGE_KEY } from './services/storage.ts'
import { formatINR } from './utils/money.ts'

function renderApp() {
  return render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

function expectCardAmount(label: string, amount: number) {
  const heading = screen.getByRole('heading', { name: label })
  const card = heading.closest('article')
  if (!(card instanceof HTMLElement)) throw new Error(`Missing card for ${label}`)
  expect(within(card).getByText(formatINR(amount))).toBeInTheDocument()
}

async function openTransactions(user: ReturnType<typeof userEvent.setup>) {
  const [button] = screen.getAllByRole('button', { name: 'Transactions' })
  if (!button) throw new Error('Missing Transactions navigation')
  await user.click(button)
}

describe('Expense Tracker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows demo totals calculated from the sample list', async () => {
    renderApp()

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expectCardAmount('Total Income', 48500)
    expectCardAmount('Total Expenses', 14950)
    expectCardAmount('Net Balance', 33550)
    expect(screen.getByText('Surplus: income is higher')).toBeInTheDocument()
    expect(screen.getByText('Monthly salary')).toBeInTheDocument()
    expect(screen.getByText('Expenses only. Income is not included.')).toBeInTheDocument()
  })

  it('does not replace saved demo records on a later visit', async () => {
    const first = renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })
    const saved = localStorage.getItem(STORAGE_KEY)
    first.unmount()

    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    expect(localStorage.getItem(STORAGE_KEY)).toBe(saved)
    expect(JSON.parse(saved ?? '[]')).toHaveLength(createDemoTransactions().length)
  })

  it('adds a transaction, updates the income total, and restores it after remounting', async () => {
    const user = userEvent.setup()
    const first = renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await user.click(screen.getByRole('button', { name: 'Add transaction' }))
    await user.type(screen.getByLabelText('Title'), 'Scholarship')
    await user.type(screen.getByLabelText('Amount (₹)'), '1000')
    await user.click(screen.getByRole('radio', { name: /Income/ }))
    await user.selectOptions(screen.getByLabelText('Category'), 'Gift')
    await user.click(screen.getByRole('button', { name: 'Save transaction' }))

    expect(await screen.findByText('Transaction added.')).toBeInTheDocument()
    expect(screen.getByText('Scholarship')).toBeInTheDocument()
    expectCardAmount('Total Income', 49500)
    expectCardAmount('Net Balance', 34550)

    first.unmount()
    renderApp()
    expect(await screen.findByText('Scholarship')).toBeInTheDocument()
    expectCardAmount('Total Income', 49500)
  })

  it('shows validation errors and does not save an invalid amount', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await user.click(screen.getByRole('button', { name: 'Add transaction' }))
    await user.click(screen.getByRole('button', { name: 'Save transaction' }))

    expect(screen.getByText('Enter a title.')).toBeInTheDocument()
    expect(screen.getByText('Choose income or expense.')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const amount = screen.getByLabelText('Amount (₹)')
    await user.type(amount, 'abc')
    await user.click(screen.getByRole('button', { name: 'Save transaction' }))
    expect(screen.getByText(/greater than 0/i)).toBeInTheDocument()

    await user.clear(amount)
    await user.type(amount, '0')
    await user.click(screen.getByRole('button', { name: 'Save transaction' }))
    expect(screen.getByText(/greater than 0/i)).toBeInTheDocument()
    expectCardAmount('Total Income', 48500)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toHaveLength(createDemoTransactions().length)
  })

  it('asks before deleting and then updates the totals', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await user.click(screen.getByRole('button', { name: /Delete Monthly salary/ }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Monthly salary')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Delete Monthly salary/ }))
    await user.click(screen.getByRole('button', { name: 'Delete transaction' }))

    expect(await screen.findByText('Transaction deleted.')).toBeInTheDocument()
    expect(screen.queryByText('Monthly salary')).not.toBeInTheDocument()
    expectCardAmount('Total Income', 6500)
    expectCardAmount('Net Balance', 33550 - 42000)
  })

  it('searches by note on the transactions page', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })
    await openTransactions(user)

    await user.type(screen.getByLabelText('Search'), 'milk')

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.queryByText('Monthly salary')).not.toBeInTheDocument()
    expect(screen.getByText(/Showing 1 of/)).toBeInTheDocument()

    const [dashboard] = screen.getAllByRole('button', { name: 'Dashboard' })
    if (!dashboard) throw new Error('Missing Dashboard navigation')
    await user.click(dashboard)
    expectCardAmount('Total Income', 48500)
    expectCardAmount('Total Expenses', 14950)
  })

  it('edits a transaction and recalculates expenses from the full list', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await user.click(screen.getByRole('button', { name: /Edit Groceries/ }))
    const amount = screen.getByLabelText('Amount (₹)')
    await user.clear(amount)
    await user.type(amount, '2000')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Transaction updated.')).toBeInTheDocument()
    expectCardAmount('Total Expenses', 15090)
    expect(screen.getByText('Vegetables and milk')).toBeInTheDocument()
  })

  it('resets the demo list after confirmation', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Dashboard' })

    await user.click(screen.getByRole('button', { name: 'Add transaction' }))
    await user.type(screen.getByLabelText('Title'), 'Scholarship')
    await user.type(screen.getByLabelText('Amount (₹)'), '1000')
    await user.click(screen.getByRole('radio', { name: /Income/ }))
    await user.selectOptions(screen.getByLabelText('Category'), 'Gift')
    await user.click(screen.getByRole('button', { name: 'Save transaction' }))
    expect(await screen.findByText('Scholarship')).toBeInTheDocument()

    const [about] = screen.getAllByRole('button', { name: 'About' })
    if (!about) throw new Error('Missing About navigation')
    await user.click(about)
    await user.click(screen.getByRole('button', { name: 'Reset demo data' }))
    await user.click(screen.getByRole('button', { name: 'Replace with demo data' }))
    expect(await screen.findByText('Demo data restored.')).toBeInTheDocument()

    const [dashboard] = screen.getAllByRole('button', { name: 'Dashboard' })
    if (!dashboard) throw new Error('Missing Dashboard navigation')
    await user.click(dashboard)

    expect(screen.queryByText('Scholarship')).not.toBeInTheDocument()
    expectCardAmount('Total Income', 48500)
  })

  it('keeps malformed storage and shows a warning', async () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    renderApp()

    expect(await screen.findByText(/could not be read/i)).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{not json')
    expectCardAmount('Total Income', 0)
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
  })

  it('does not seed over an empty saved list', async () => {
    localStorage.setItem(STORAGE_KEY, '[]')
    const user = userEvent.setup()
    renderApp()

    expect(await screen.findByText('No transactions yet')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
    expectCardAmount('Total Income', 0)

    await openTransactions(user)
    expect(screen.getByText(/restore the demo set/i)).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
  })
})
