import { useState } from 'react'

import { highlightSql } from '../utils/highlight-sql'

type SqlBlockProps = {
  sql: string
  resultSnapshot?: string | null
}

type ParsedTable = {
  columns: string[]
  rows: string[][]
}

function parseSnapshot(snapshot: string): ParsedTable | null {
  const records = snapshot
    .split(';')
    .map((r) => r.trim())
    .filter(Boolean)
  if (records.length < 2) return null

  const parsed = records.map((record) => {
    const fields: Record<string, string> = {}
    record.split(',').forEach((field) => {
      const colon = field.indexOf(':')
      if (colon !== -1) {
        fields[field.slice(0, colon).trim()] = field.slice(colon + 1).trim()
      }
    })
    return fields
  })

  const columns = Object.keys(parsed[0] ?? {})
  if (columns.length === 0) return null

  const rows = parsed.map((record) => columns.map((col) => record[col] ?? ''))
  return { columns, rows }
}

export const SqlBlock = ({ sql, resultSnapshot }: SqlBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const table = resultSnapshot ? parseSnapshot(resultSnapshot) : null

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-md border border-edge-2">
        <div className="flex items-center justify-between border-b border-edge-2 bg-surface-2 px-3.5 py-1.5">
          <span className="font-mono text-[10px] font-medium tracking-wide text-ink-muted">
            GENERATED SQL
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="font-mono text-[10px] text-ink-ghost hover:text-ink-faint"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto bg-surface px-3.5 py-2.5 font-mono text-xs leading-7 whitespace-pre-wrap">
          {highlightSql(sql)}
        </pre>
      </div>

      {resultSnapshot && (
        <div className="overflow-hidden rounded-md border border-edge-2 bg-canvas">
          <div className="border-b border-edge-2 bg-surface-2 px-3.5 py-1.5">
            <span className="font-mono text-[10px] font-medium tracking-wide text-ink-muted">
              RESULT
            </span>
          </div>
          {table ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-2">
                    {table.columns.map((col) => (
                      <th
                        key={col}
                        className="px-3.5 py-2 font-mono text-[10px] font-semibold tracking-wide text-violet"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-edge-2 hover:bg-surface-2/50"
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`px-3.5 py-2 font-mono text-[11px] ${/^\d+(\.\d+)?$/.test(cell) ? 'text-ink' : 'text-accent'}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-3.5 py-2.5 text-xs leading-5 text-ink-dim">
              {resultSnapshot}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
