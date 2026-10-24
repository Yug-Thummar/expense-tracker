/** Stable id for a transaction. It does not change when the record is edited. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
