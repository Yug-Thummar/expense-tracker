import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  message: string
  action?: ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
