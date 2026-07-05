import type { QueryResult } from '@/types/query-result'

type ResultTableProps = {
  result: QueryResult
}

export const ResultTable = ({ result }: ResultTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-edge-2">
      <div className="flex items-center justify-between border-b border-edge-2 bg-surface-2 px-3.5 py-1.5">
        <span className="font-mono text-[10px] font-medium tracking-wide text-ink-muted">
          RESULT
        </span>
        <span className="font-mono text-[10px] text-ink-ghost">
          {result.rows.length} row{result.rows.length === 1 ? '' : 's'} ·{' '}
          {result.durationMs}ms
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {result.columns.map((column) => (
              <th
                key={column}
                className="border-b border-edge-2 bg-surface px-3.5 py-1.5 text-left font-mono text-[10px] text-ink-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="bg-canvas px-3.5 py-1.5 font-mono text-[13px] font-medium text-accent"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
