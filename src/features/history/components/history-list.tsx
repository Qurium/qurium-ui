import { cn } from '@/utils/cn'
import { formatRelativeTime } from '@/utils/format'

import type { HistoryEntry } from '../types'

type HistoryListProps = {
  entries: HistoryEntry[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export const HistoryList = ({
  entries,
  selectedIndex,
  onSelect,
}: HistoryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="flex w-120 flex-none items-center justify-center border-r border-edge">
        <p className="text-sm text-ink-muted">No queries yet</p>
      </div>
    )
  }

  return (
    <div className="w-120 flex-none overflow-y-auto border-r border-edge">
      {entries.map((entry, i) => {
        const isSelected = i === selectedIndex
        return (
          <button
            key={`${entry.executedAt}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
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
                  entry.status === 'SUCCESS'
                    ? 'bg-accent/10 text-accent'
                    : 'bg-amber/10 text-amber',
                )}
              >
                {entry.status}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-ink-ghost">
              <span>{formatRelativeTime(entry.executedAt)}</span>
              {entry.executionTimeMs !== null && (
                <>
                  <span>·</span>
                  <span>{entry.executionTimeMs}ms</span>
                </>
              )}
              {entry.rowsReturned !== null && (
                <>
                  <span>·</span>
                  <span>
                    {entry.rowsReturned}{' '}
                    {entry.rowsReturned === 1 ? 'row' : 'rows'}
                  </span>
                </>
              )}
              {entry.status === 'FAILED' && entry.executionTimeMs === null && (
                <>
                  <span>·</span>
                  <span>failed</span>
                </>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
