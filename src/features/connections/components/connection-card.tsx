import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/features/notifications/stores/notifications-store'
import { Database, SquarePen, Trash2 } from 'lucide-react'

import { Dialog } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/utils/cn'
import type { PaginatedResponse } from '@/types/api'
import { useReconnectConnection } from '../api/reconnect-connection'

import { DetailRow } from './detail-row'
import type { Connection } from '../types'
import { useIntrospectConnection } from '../api/introspect-connection'
import { useDeleteConnection } from '../api/delete-connection'

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
  const reconnectConnection = useReconnectConnection()
  const introspectConnection = useIntrospectConnection()
  const deleteConnection = useDeleteConnection()
  const queryClient = useQueryClient()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const { addNotification } = useNotifications()

  const handleReconnect = () => {
    reconnectConnection.mutate(connection.id, {
      onSuccess: () => {
        const pages = queryClient.getQueriesData<PaginatedResponse<Connection>>(
          { queryKey: ['connections'] },
        )
        const updated = pages
          .flatMap(([, data]) => data?.content ?? [])
          .find((c) => c.id === connection.id)

        if (updated?.isConnected) {
          addNotification({
            type: 'success',
            title: 'Connection successful',
            message: `${connection.name} is now connected.`,
            duration: 4000,
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Connection failed',
            message: `${connection.name} could not be reached.`,
            duration: 4000,
          })
        }
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Connection failed',
          message: `${connection.name} could not be connected.`,
          duration: 4000,
        })
      },
    })
  }

  const handleIntrospect = () => {
    introspectConnection.mutate(connection.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] })
        addNotification({
          type: 'success',
          title: 'Introspection successful',
          message: `${connection.name} has been introspected.`,
          duration: 4000,
        })
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Introspection failed',
          message: `${connection.name} could not be introspected.`,
          duration: 4000,
        })
      },
    })
  }

  const handleDelete = () => {
    deleteConnection.mutate(connection.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] })
        setDeleteOpen(true)
        addNotification({
          type: 'success',
          title: 'Connection deleted',
          message: `${connection.name} has been removed.`,
          duration: 4000,
        })
      },
      onError: () => {
        setDeleteOpen(true)
        addNotification({
          type: 'error',
          title: 'Failed to delete connection',
          message: `${connection.name} could not be removed.`,
          duration: 4000,
        })
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
              disabled={reconnectConnection.isPending}
              onClick={handleReconnect}
              className="flex-1 rounded-md border border-edge-2 py-1.5 text-center text-[11px] font-medium text-ink-faint hover:border-ink-muted disabled:opacity-50"
            >
              {reconnectConnection.isPending
                ? 'Connecting…'
                : 'Retry Connection'}
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="More actions"
          className="flex size-9 items-center justify-center rounded-md border border-edge-2 text-ink-muted hover:border-ink-muted"
        >
          <SquarePen size={14} />
        </button>
        <button
          onClick={setDeleteOpen.bind(null, true)}
          type="button"
          aria-label="More actions"
          className="flex size-9 items-center justify-center rounded-md border border-edge-2 text-ink-muted hover:border-ink-muted"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => !open && setDeleteOpen(false)}
      >
        <ConfirmDialog
          message="Are you sure you want to delete this connection?"
          isPending={deleteConnection.isPending}
          onConfirm={handleDelete}
        />
      </Dialog>
    </div>
  )
}
