import { useState } from 'react'
import { ChevronDown, ChevronRight, Key, Rows3 } from 'lucide-react'

import { cn } from '@/utils/cn'

import type { SchemaTable } from '../types'
import { getForeignKeys, getReferencedBy } from '../utils'

type SchemaListProps = {
  tables: SchemaTable[]
}

export const SchemaList = ({ tables }: SchemaListProps) => {
  const [expanded, setExpanded] = useState<string | undefined>(tables[0]?.name)

  return (
    <div className="flex-1 overflow-y-auto bg-canvas">
      <div className="sticky top-0 z-10 grid grid-cols-[240px_80px_1fr_140px_100px] items-center gap-2 border-b border-edge bg-surface px-6 py-2.5">
        <span className="font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
          TABLE NAME
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
          COLUMNS
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
          FOREIGN KEYS
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
          REFERENCED BY
        </span>
        <span className="text-right font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
          ROWS (est.)
        </span>
      </div>

      {tables.map((table) => {
        const isOpen = expanded === table.name
        const foreignKeys = getForeignKeys(table)
        const referencedBy = getReferencedBy(table, tables)

        return (
          <div key={table.name} className="border-b border-edge">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? undefined : table.name)}
              className={cn(
                'grid w-full grid-cols-[240px_80px_1fr_140px_100px] items-center gap-2 border-l-2 px-6 py-3 text-left hover:bg-surface',
                isOpen ? 'border-l-accent bg-accent/3' : 'border-l-transparent',
              )}
            >
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown size={10} className="text-accent" />
                ) : (
                  <ChevronRight size={10} className="text-ink-muted" />
                )}
                <Rows3
                  size={14}
                  strokeWidth={1.4}
                  className={isOpen ? 'text-accent' : 'text-ink-muted'}
                />
                <span
                  className={cn(
                    'font-mono text-xs font-semibold',
                    isOpen ? 'text-accent' : 'text-ink',
                  )}
                >
                  {table.name}
                </span>
              </div>
              <span className="font-mono text-xs text-ink-dim">
                {table.columns.length}
              </span>
              <div className="flex flex-wrap gap-1">
                {foreignKeys.length === 0 && (
                  <span className="font-mono text-[11px] text-ink-muted">
                    —
                  </span>
                )}
                {foreignKeys.map((column) => (
                  <span
                    key={column.name}
                    className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-blue"
                  >
                    → {column.references!.table}.{column.references!.column}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {referencedBy.length === 0 && (
                  <span className="font-mono text-[11px] text-ink-muted">
                    —
                  </span>
                )}
                {referencedBy.map((ref) => (
                  <span
                    key={`${ref.table}.${ref.column}`}
                    className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-blue"
                  >
                    {ref.table}
                  </span>
                ))}
              </div>
              <span className="text-right font-mono text-xs text-ink-faint">
                {table.rowCount.toLocaleString()}
              </span>
            </button>

            {isOpen && (
              <div className="px-6 pb-3 pl-14">
                <div className="overflow-hidden rounded-md border border-edge-2 bg-surface-2">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {['COLUMN', 'TYPE', 'NULLABLE', 'KEY', 'DEFAULT'].map(
                          (heading) => (
                            <th
                              key={heading}
                              className="border-b border-edge-2 bg-surface px-3.5 py-2 text-left font-mono text-[10px] font-semibold tracking-wide text-ink-muted"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((column) => (
                        <tr
                          key={column.name}
                          className="border-b border-[#141c26] last:border-b-0"
                        >
                          <td className="px-3.5 py-1.5 font-mono text-[11px] text-ink">
                            <div className="flex items-center gap-1.5">
                              {column.isPrimaryKey ? (
                                <Key size={8} className="text-amber" />
                              ) : (
                                <span className="w-2" />
                              )}
                              {column.name}
                            </div>
                          </td>
                          <td className="px-3.5 py-1.5 font-mono text-[11px] text-ink-faint">
                            {column.type}
                          </td>
                          <td className="px-3.5 py-1.5 font-mono text-[11px] text-ink-faint">
                            {column.nullable ? 'NULL' : 'NOT NULL'}
                          </td>
                          <td className="px-3.5 py-1.5 font-mono text-[10px] font-medium text-amber">
                            {column.isPrimaryKey
                              ? 'PK'
                              : column.isUnique
                                ? 'UQ'
                                : '—'}
                          </td>
                          <td className="px-3.5 py-1.5 font-mono text-[11px] text-ink-muted">
                            {column.default ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {table.indices.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
                      INDICES
                    </span>
                    {table.indices.map((index) => (
                      <span
                        key={index.name}
                        className="rounded bg-surface-3 px-2 py-0.5 font-mono text-[10px] text-ink-faint"
                      >
                        {index.name} ({index.columns.join(', ')})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
