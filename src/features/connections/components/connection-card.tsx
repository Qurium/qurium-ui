import { Database, MoreHorizontal } from 'lucide-react'

import type { Connection } from '../types'

const TYPE_LABELS: Record<string, string> = {
  POSTGRES: 'PostgreSQL',
  MYSQL: 'MySQL',
  ORACLE: 'Oracle',
  SQLSERVER: 'SQL Server',
}

type ConnectionCardProps = {
  connection: Connection
}

export const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  return (
    <div className="rounded-lg border border-edge-2 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-surface-3">
          <Database size={20} strokeWidth={1.3} className="text-blue" />
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">
            {connection.name}
          </div>
          <div className="font-mono text-[11px] text-ink-muted">
            {TYPE_LABELS[connection.type] ?? connection.type}
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-1.5 rounded-md bg-canvas p-3">
        <Row label="Host" value={`${connection.host}:${connection.port}`} />
        <Row label="Database" value={connection.databaseName} />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted"
        >
          Introspect
        </button>
        <button
          type="button"
          className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted"
        >
          Query
        </button>
        <button
          type="button"
          aria-label="More actions"
          className="flex size-9 items-center justify-center rounded-md border border-edge-2 text-ink-muted hover:border-ink-muted"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-[11px] text-ink-muted">{label}</span>
    <span className="font-mono text-[11px] text-ink-faint">{value}</span>
  </div>
)
