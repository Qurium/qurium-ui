import { cn } from '@/utils/cn'
import { formatRelativeTime } from '@/utils/format'

import type { HistoryEntry } from '../types'

type HistoryListProps = {
  entries: HistoryEntry[]
  selectedId?: string
  onSelect: (id: string) => void
}

export const HistoryList = ({
  entries,
  selectedId,
  onSelect,
}: HistoryListProps) => {
  return (
    <div className="w-120 flex-none overflow-y-auto border-r border-edge">
      {entries.map((entry) => {
        const isSelected = entry.id === selectedId
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry.id)}
            className={cn(
              'w-full border-b border-edge px-5 py-3.5 text-left hover:bg-surface',
              isSelected
                ? 'border-l-2 border-l-accent bg-accent/4'
                : 'border-l-2 border-l-transparent',
            )}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span
                className={cn(
                  'truncate text-sm',
                  isSelected ? 'text-ink' : 'text-ink-dim',
                )}
              >
                {entry.question}
              </span>
              <span
                className={cn(
                  'shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-medium',
                  entry.status === 'success'
                    ? 'bg-accent/10 text-accent'
                    : 'bg-amber/10 text-amber',
                )}
              >
                {entry.status === 'success' ? 'SUCCESS' : 'FAILED'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-ink-ghost">
              <span>{formatRelativeTime(entry.createdAt)}</span>
              {entry.durationMs !== null && (
                <>
                  <span>·</span>
                  <span>{entry.durationMs}ms</span>
                </>
              )}
              {entry.result && (
                <>
                  <span>·</span>
                  <span>{entry.result.rows.length} rows</span>
                </>
              )}
              {entry.errorMessage && (
                <>
                  <span>·</span>
                  <span>{entry.errorMessage}</span>
                </>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
