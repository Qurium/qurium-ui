import { formatDate } from '@/utils/format'

import type { HistoryEntry } from '../types'

type HistoryDetailProps = {
  entry: HistoryEntry
  ownerName: string
}

export const HistoryDetail = ({ entry, ownerName }: HistoryDetailProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-3 text-base font-medium text-ink">{entry.question}</h2>

      <div className="mb-5 flex flex-wrap gap-2">
        {ownerName && (
          <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
            {ownerName}
          </span>
        )}
        <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          {formatDate(entry.executedAt)}
        </span>
        {entry.executionTimeMs !== null && (
          <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-accent">
            {entry.executionTimeMs}ms
          </span>
        )}
      </div>

      {entry.status === 'FAILED' ? (
        <div className="rounded-md border border-amber/20 bg-amber/6 px-4 py-3 text-sm text-amber">
          Query failed
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entry.rowsReturned !== null && (
            <div className="flex items-center gap-3 rounded-md border border-edge-2 bg-surface-3 px-4 py-3">
              <span className="font-mono text-xs text-ink-muted">
                rows returned
              </span>
              <span className="font-mono text-sm font-semibold text-accent">
                {entry.rowsReturned}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-edge-2 px-3.5 py-1.5 text-xs font-medium text-ink-faint hover:border-ink-muted"
            >
              Re-run query
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
