import { SqlBlock } from '@/features/query/components/sql-block'
import { ResultTable } from '@/features/query/components/result-table'
import { formatDate } from '@/utils/format'

import type { HistoryEntry } from '../types'

type HistoryDetailProps = {
  entry: HistoryEntry
  connectionName: string
}

export const HistoryDetail = ({
  entry,
  connectionName,
}: HistoryDetailProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="mb-3 text-base font-medium text-ink">{entry.question}</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          {connectionName}
        </span>
        <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          {formatDate(entry.createdAt)}
        </span>
        {entry.durationMs !== null && (
          <span className="rounded-md bg-surface-3 px-2.5 py-1 font-mono text-[11px] text-accent">
            {entry.durationMs}ms
          </span>
        )}
      </div>

      {entry.status === 'failed' ? (
        <div className="rounded-md border border-amber/20 bg-amber/6 px-4 py-3 text-sm text-amber">
          Query failed: {entry.errorMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entry.sql && <SqlBlock sql={entry.sql} />}

          {entry.explanation && (
            <div className="rounded-md border border-edge-2 bg-surface-3 px-3.5 py-3 text-sm leading-6 text-ink-faint">
              {entry.explanation}
            </div>
          )}

          {entry.result && <ResultTable result={entry.result} />}

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-edge-2 px-3.5 py-1.5 text-xs font-medium text-ink-faint hover:border-ink-muted"
            >
              Re-run query
            </button>
            <button
              type="button"
              className="rounded-md border border-edge-2 px-3.5 py-1.5 text-xs font-medium text-ink-faint hover:border-ink-muted"
            >
              Copy SQL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
