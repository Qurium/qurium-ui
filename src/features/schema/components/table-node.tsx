import { Key, Link2, Rows3 } from 'lucide-react'

import { cn } from '@/utils/cn'

import type { SchemaTable } from '../types'

type TableNodeProps = {
  table: SchemaTable
  selected?: boolean
  style?: React.CSSProperties
  onSelect?: () => void
}

export const TableNode = ({
  table,
  selected,
  style,
  onSelect,
}: TableNodeProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={style}
      className={cn(
        'absolute w-58 overflow-hidden rounded-lg border bg-surface-2 text-left shadow-lg',
        selected ? 'z-10 border-accent shadow-accent/10' : 'z-0 border-edge-2',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between border-b border-edge-2 px-3.5 py-2.5',
          selected && 'bg-accent/8',
        )}
      >
        <div className="flex items-center gap-2">
          <Rows3
            size={14}
            strokeWidth={1.4}
            className={selected ? 'text-accent' : 'text-ink-muted'}
          />
          <span
            className={cn(
              'font-mono text-xs font-semibold',
              selected ? 'text-accent' : 'text-ink',
            )}
          >
            {table.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-ghost">
          {table.columns.length} cols
        </span>
      </div>
      <div className="py-1.5">
        {table.columns.map((column) => (
          <div
            key={column.name}
            className="flex items-center gap-2 px-3.5 py-1"
          >
            {column.isPrimaryKey ? (
              <Key size={10} className="shrink-0 text-amber" />
            ) : column.references ? (
              <Link2 size={10} className="shrink-0 text-blue" />
            ) : (
              <span className="w-2.5 shrink-0" />
            )}
            <span
              className={cn(
                'font-mono text-[11px]',
                column.isPrimaryKey
                  ? 'text-ink'
                  : column.references
                    ? 'text-blue'
                    : 'text-ink-dim',
              )}
            >
              {column.name}
            </span>
            <span className="flex-1" />
            <span className="font-mono text-[10px] text-ink-muted">
              {column.references
                ? `${column.type} → ${column.references.table}`
                : column.type}
            </span>
          </div>
        ))}
      </div>
    </button>
  )
}
