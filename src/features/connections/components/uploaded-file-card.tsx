import { FileCode, MoreHorizontal } from 'lucide-react'

import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'

import { DetailRow } from './detail-row'
import type { UploadedFile } from '../types'

type UploadedFileCardProps = {
  file: UploadedFile
}

export const UploadedFileCard = ({ file }: UploadedFileCardProps) => {
  const isDeleted = Boolean(file.deletedAt)

  return (
    <div className="rounded-lg border border-edge-2 bg-surface-2 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-surface-3">
            <FileCode size={20} strokeWidth={1.3} className="text-violet" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">{file.name}</div>
            <div className="font-mono text-[11px] text-ink-muted">
              DDL import
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'size-2.5 rounded-full',
              isDeleted ? 'bg-ink-muted' : 'bg-violet',
            )}
            aria-hidden
          />
          <span
            className={cn(
              'text-[12px]',
              isDeleted ? 'text-ink-muted' : 'text-violet',
            )}
          >
            {isDeleted ? 'Deleted' : 'Uploaded'}
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-1.5 rounded-md bg-canvas p-3">
        <DetailRow label="Source" value={file.fileName} />
        <DetailRow label="Uploaded" value={formatDate(file.updatedAt)} />
        <DetailRow
          label="Schema"
          value={`${file.tableCount} ${file.tableCount === 1 ? 'table' : 'tables'} · UPLOADED_DDL`}
          valueClassName={'text-violet font-black'}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted"
        >
          View schema
        </button>
        <button
          type="button"
          className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted"
        >
          Re-upload
        </button>
        <button
          type="button"
          aria-label="More actions"
          className="flex size-9 items-center justify-center rounded-md border border-edge-2 text-ink-muted hover:border-ink-muted"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}
