import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Link2, Rows3, Star } from 'lucide-react'

import { cn } from '@/utils/cn'

import type { SchemaTable } from '../types'

export type TableNodeData = {
  table: SchemaTable
  selected?: boolean
}

export type TableNodeType = Node<TableNodeData, 'tableNode'>

export const TableNode = ({ data, selected }: NodeProps<TableNodeType>) => {
  const { table } = data

  const handleClass = '!h-2 !w-2 !border-edge !bg-accent/50'

  return (
    <div
      className={cn(
        'w-58 overflow-hidden rounded-lg border bg-surface-2 text-left shadow-lg',
        selected ? 'border-accent shadow-accent/10' : 'border-edge-2',
      )}
    >
      <Handle
        id="left-target"
        type="target"
        position={Position.Left}
        className={handleClass}
      />
      <Handle
        id="left-source"
        type="source"
        position={Position.Left}
        className={handleClass}
      />
      <Handle
        id="right-target"
        type="target"
        position={Position.Right}
        className={handleClass}
      />
      <Handle
        id="right-source"
        type="source"
        position={Position.Right}
        className={handleClass}
      />

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
              <Star size={10} className="shrink-0 text-amber" />
            ) : column.references ? (
              <Link2 size={10} className="shrink-0 text-violet" />
            ) : (
              <span className="w-2.5 shrink-0" />
            )}
            <span
              className={cn(
                'font-mono text-[11px]',
                column.isPrimaryKey
                  ? 'text-amber'
                  : column.references
                    ? 'text-violet'
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
    </div>
  )
}
