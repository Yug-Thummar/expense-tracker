/** One crore rupees. Larger values are rejected by the form and by storage checks. */
export const MAX_AMOUNT = 100_000_000

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatINR(amount: number): string {
  return INR_FORMATTER.format(amount)
}

/** Whole paise, so totals do not drift from binary floating point. */
export function toPaise(amount: number): number {
  return Math.round(amount * 100)
}

export function sumAmounts(amounts: number[]): number {
  const paise = amounts.reduce((total, amount) => total + toPaise(amount), 0)
  return paise / 100
}
