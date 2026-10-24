import { CircleAlert, CircleCheck, X } from 'lucide-react'
import type { BannerState } from '../hooks/useTransactions.ts'

export function Banner({ banner, onDismiss }: { banner: BannerState; onDismiss: () => void }) {
  const isError = banner.tone === 'error'

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-3">
      <div
        role={isError ? 'alert' : 'status'}
        className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-card ${
          isError ? 'border-clay/30 bg-clay-soft' : 'border-accent/20 bg-soft'
        }`}
      >
        {isError ? (
          <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0 text-clay" size={18} />
        ) : (
          <CircleCheck aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={18} />
        )}
        <p className="flex-1 text-sm leading-5 text-ink">{banner.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  )
}

export function StorageWarning({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-clay/30 bg-clay-soft px-4 py-3">
      <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0 text-clay" size={18} />
      <p className="flex-1 text-sm leading-6 text-ink">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss warning"
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink"
      >
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  )
}
