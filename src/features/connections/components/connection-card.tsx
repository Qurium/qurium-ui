import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Database, MoreHorizontal, XCircle } from 'lucide-react'

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/utils/cn'
import type { PaginatedResponse } from '@/types/api'
import { useReconnectConnection } from '../api/reconnect-connection'

import { DetailRow } from './detail-row'
import type { Connection } from '../types'
import { useIntrospectConnection } from '../api/introspect-connection'

const TYPE_LABELS: Record<string, string> = {
  POSTGRES: 'PostgreSQL',
  MYSQL: 'MySQL',
  ORACLE: 'Oracle',
}

type ConnectionCardProps = {
  connection: Connection
}

export const ConnectionCard = ({ connection }: ConnectionCardProps) => {
  const isConnected = connection.isConnected
  const reconnect = useReconnectConnection()
  const introspect = useIntrospectConnection()
  const queryClient = useQueryClient()
  const [reconnectOpen, setReconnectOpen] = useState(false)
  const [reconnectResult, setReconnectResult] = useState<'success' | 'error'>(
    'error',
  )
  const [introspectOpen, setIntrospectOpen] = useState(false)
  const [introspectResult, setIntrospectResult] = useState<'success' | 'error'>(
    'error',
  )

  const handleReconnect = () => {
    reconnect.mutate(connection.id, {
      onSuccess: () => {
        const pages = queryClient.getQueriesData<PaginatedResponse<Connection>>(
          { queryKey: ['connections'] },
        )
        const updated = pages
          .flatMap(([, data]) => data?.content ?? [])
          .find((c) => c.id === connection.id)
        setReconnectResult(updated?.isConnected ? 'success' : 'error')
        setReconnectOpen(true)
      },
      onError: () => {
        setReconnectResult('error')
        setReconnectOpen(true)
      },
    })
  }

  const handleIntrospect = () => {
    introspect.mutate(connection.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] })
        setIntrospectResult('success')
        setIntrospectOpen(true)
      },
      onError: () => {
        setIntrospectResult('error')
        setIntrospectOpen(true)
      },
    })
  }

  return (
    <div className="rounded-lg border border-edge-2 bg-surface-2 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-surface-3">
            <Database
              size={20}
              strokeWidth={1.3}
              className={isConnected ? 'text-accent' : 'text-amber'}
            />
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
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'size-2.5 rounded-full',
              isConnected ? 'bg-accent' : 'bg-amber',
            )}
            aria-hidden
          />
          <span
            className={cn(
              'text-[12px]',
              isConnected ? 'text-accent' : 'text-amber',
            )}
          >
            {isConnected ? 'Connected' : 'Unreachable'}
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-1.5 rounded-md bg-canvas p-3">
        <DetailRow
          label="Host"
          value={`${connection.host}:${connection.port}`}
        />
        <DetailRow label="Database" value={connection.databaseName} />
        {connection.username && (
          <DetailRow label="Username" value={connection.username} />
        )}
        <DetailRow
          label="Schema"
          value={
            isConnected
              ? `${connection.tableCount} ${
                  connection.tableCount === 1 ? 'table' : 'tables'
                } · CONNECTED`
              : 'CONNECT TO VIEW'
          }
          valueClassName={isConnected ? 'text-accent' : 'text-amber'}
        />
      </div>

      <div className="flex gap-2">
        {isConnected && (
          <>
            <button
              disabled={reconnect.isPending}
              onClick={handleIntrospect}
              type="button"
              className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted"
            >
              Introspect
            </button>
          </>
        )}
        {!isConnected && (
          <>
            <button
              type="button"
              disabled={reconnect.isPending}
              onClick={handleReconnect}
              className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted disabled:opacity-50"
            >
              {reconnect.isPending ? 'Connecting…' : 'Retry Connection'}
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="More actions"
          className="flex size-9 items-center justify-center rounded-md border border-edge-2 text-ink-muted hover:border-ink-muted"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <Dialog
        open={reconnectOpen}
        onOpenChange={(open) => !open && setReconnectOpen(false)}
      >
        <DialogContent className="max-w-sm border border-edge-2 bg-surface p-0 shadow-2xl">
          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            {reconnectResult === 'success' ? (
              <>
                <CheckCircle2
                  size={36}
                  strokeWidth={1.3}
                  className="text-accent"
                />
                <p className="text-sm font-semibold text-ink">
                  Connection restored
                </p>
                <p className="text-xs text-ink-muted">
                  Successfully reconnected to{' '}
                  <span className="font-medium text-ink">
                    {connection.name}
                  </span>
                  .
                </p>
              </>
            ) : (
              <>
                <XCircle size={36} strokeWidth={1.3} className="text-amber" />
                <p className="text-sm font-semibold text-ink">
                  Connection failed
                </p>
                <p className="text-xs text-ink-muted">
                  Could not reconnect to{' '}
                  <span className="font-medium text-ink">
                    {connection.name}
                  </span>
                  .<br />
                  Please check your connection settings and try again.
                </p>
              </>
            )}
            <DialogClose className="mt-2 rounded-md border border-edge-2 px-5 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={introspectOpen}
        onOpenChange={(open) => !open && setIntrospectOpen(false)}
      >
        <DialogContent className="max-w-sm border border-edge-2 bg-surface p-0 shadow-2xl">
          <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            {introspectResult === 'success' ? (
              <>
                <CheckCircle2
                  size={36}
                  strokeWidth={1.3}
                  className="text-accent"
                />
                <p className="text-sm font-semibold text-ink">
                  Introspected with success!
                </p>
              </>
            ) : (
              <>
                <XCircle size={36} strokeWidth={1.3} className="text-amber" />
                <p className="text-sm font-semibold text-ink">
                  An error occurred while introspecting the connection
                </p>
              </>
            )}
            <DialogClose className="mt-2 rounded-md border border-edge-2 px-5 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
