const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Local calendar date as YYYY-MM-DD. Avoids UTC shifting the day. */
export function formatLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(): string {
  return formatLocalISODate(new Date())
}

export function daysAgo(days: number): string {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() - days)
  return formatLocalISODate(date)
}

/** Day 15 of the previous month. Day 15 avoids short-month overflow. */
export function midPreviousMonth(): string {
  const now = new Date()
  return formatLocalISODate(new Date(now.getFullYear(), now.getMonth() - 1, 15, 12))
}

export function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 2000 || year > 2100) return false

  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function formatDisplayDate(isoDate: string): string {
  const match = ISO_DATE.exec(isoDate)
  if (!match) return isoDate

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
