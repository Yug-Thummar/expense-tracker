import { dangerButtonClass, secondaryButtonClass } from '../ui.ts'
import { Dialog } from './Dialog.tsx'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog title={title} description={message} onClose={onCancel}>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" data-autofocus onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className={dangerButtonClass}>
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
