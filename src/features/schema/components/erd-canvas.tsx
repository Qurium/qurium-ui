import { useMemo, useState } from 'react'
import { Key, Link2, Minus, Plus } from 'lucide-react'

import type { SchemaTable } from '../types'
import { TableNode } from './table-node'

const TABLE_WIDTH = 232
const HEADER_HEIGHT = 41
const ROW_HEIGHT = 27
const RELATION_COLORS = ['#00d4aa', '#0090ff', '#e8a838', '#c084fc']

const tableHeight = (table: SchemaTable) =>
  HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + 12

type ErdCanvasProps = {
  tables: SchemaTable[]
}

export const ErdCanvas = ({ tables }: ErdCanvasProps) => {
  const [selected, setSelected] = useState<string | undefined>(tables[0]?.name)

  const byName = useMemo(
    () => new Map(tables.map((table) => [table.name, table])),
    [tables],
  )

  const relations = useMemo(() => {
    const paths = tables.flatMap((table) =>
      table.columns
        .filter((column) => column.references)
        .map((column) => {
          const target = byName.get(column.references!.table)
          if (!target) return null

          const from = {
            x: table.position.x + TABLE_WIDTH,
            y: table.position.y + tableHeight(table) / 2,
          }
          const to = {
            x: target.position.x,
            y: target.position.y + tableHeight(target) / 2,
          }
          const midX = (from.x + to.x) / 2

          return {
            key: `${table.name}.${column.name}`,
            path: `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`,
          }
        })
        .filter((relation): relation is NonNullable<typeof relation> =>
          Boolean(relation),
        ),
    )

    return paths.map((relation, index) => ({
      ...relation,
      color: RELATION_COLORS[index % RELATION_COLORS.length],
    }))
  }, [tables, byName])

  const canvasWidth = Math.max(
    ...tables.map((t) => t.position.x + TABLE_WIDTH + 60),
  )
  const canvasHeight = Math.max(
    ...tables.map((t) => t.position.y + tableHeight(t) + 60),
  )

  return (
    <div className="relative flex-1 overflow-auto bg-canvas bg-[radial-gradient(circle,var(--color-edge)_1px,transparent_1px)] bg-[length:24px_24px]">
      <div
        className="relative"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={canvasWidth}
          height={canvasHeight}
        >
          {relations.map((relation) => (
            <path
              key={relation.key}
              d={relation.path}
              stroke={relation.color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="none"
              opacity={0.5}
            />
          ))}
        </svg>

        {tables.map((table) => (
          <TableNode
            key={table.name}
            table={table}
            selected={selected === table.name}
            style={{ left: table.position.x, top: table.position.y }}
            onSelect={() => setSelected(table.name)}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col overflow-hidden rounded-md border border-edge">
        <button
          type="button"
          aria-label="Zoom in"
          className="flex size-8 items-center justify-center bg-surface-2 text-ink-faint hover:text-ink-dim"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="flex size-8 items-center justify-center border-t border-edge bg-surface-2 text-ink-faint hover:text-ink-dim"
        >
          <Minus size={16} />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 rounded-md border border-edge bg-surface px-3.5 py-2">
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <Key size={10} className="text-amber" />
          Primary key
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <Link2 size={10} className="text-blue" />
          Foreign key
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <span className="h-0 w-6 border-t border-dashed border-accent" />
          Relationship
        </div>
      </div>
    </div>
  )
}
