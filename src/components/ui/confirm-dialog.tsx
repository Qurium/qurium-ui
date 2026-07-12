import { CircleAlert } from 'lucide-react'

import { DialogClose, DialogContent } from './dialog'

type ConfirmDialogProps = {
  message: string
  confirmLabel?: string
  isPending?: boolean
  onConfirm: () => void
}

export const ConfirmDialog = ({
  message,
  confirmLabel = 'Delete',
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <DialogContent className="max-w-sm border border-edge-2 bg-surface p-0 shadow-2xl">
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <CircleAlert size={36} strokeWidth={1.3} className="text-amber" />
      <p className="text-sm font-semibold text-ink">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="mt-2 rounded-md border border-edge-2 px-5 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted disabled:opacity-50"
        >
          {isPending ? 'Deleting…' : confirmLabel}
        </button>
        <DialogClose className="mt-2 rounded-md border border-edge-2 px-5 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted">
          Cancel
        </DialogClose>
      </div>
    </div>
  </DialogContent>
)
