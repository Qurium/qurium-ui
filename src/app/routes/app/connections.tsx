import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { TopBar } from '@/components/layouts/top-bar'
import { Spinner } from '@/components/ui/spinner'
import { paths } from '@/config/paths'
import { useConnections } from '@/features/connections/api/get-connections'
import { ConnectionCard } from '@/features/connections/components/connection-card'
import { UploadedFileCard } from '@/features/connections/components/uploaded-file-card'
import { useUploadedFiles } from '@/features/connections/api/get-uploaded-files'

const PAGE_SIZE = 12

const ConnectionsRoute = () => {
  const [page, setPage] = useState(0)
  const connectionsQuery = useConnections({ page, size: PAGE_SIZE })
  const connections = connectionsQuery.data?.content ?? []
  const uploadedFilesQuery = useUploadedFiles({ page, size: PAGE_SIZE })
  const uploadedFiles = uploadedFilesQuery.data?.content ?? []

  return (
    <>
      <TopBar
        title="Connections"
        meta={
          connectionsQuery.data && (
            <span className="font-mono text-[11px] text-ink-faint flex items-center gap-1">
              {connectionsQuery.data.totalElements === 1
                ? '1 connection'
                : `${connectionsQuery.data.totalElements} connections`}
              {connections.filter((c) => c.isConnected).length > 0 && (
                <>
                  <span className="text-xl text-ink-faint">·</span>
                  <span className="text-ink-faint">
                    {connections.filter((c) => c.isConnected).length} active
                  </span>
                </>
              )}
              {connections.filter((c) => !c.isConnected).length > 0 && (
                <>
                  <span className="text-xl text-ink-faint">·</span>
                  <span className="text-ink-faint">
                    {connections.filter((c) => !c.isConnected).length}{' '}
                    unreachable
                  </span>
                </>
              )}
            </span>
          )
        }
        right={
          <Link
            to={paths.app.newConnection.getHref()}
            className="rounded-md bg-linear-to-br from-accent to-accent-2 px-3.5 py-1.5 font-sans text-xs font-medium text-canvas-rail"
          >
            + New connection
          </Link>
        }
      />

      <div className="animate-in fade-in flex-1 overflow-y-auto bg-canvas p-6 duration-200">
        {connectionsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {connections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
              {uploadedFiles.map((file) => (
                <UploadedFileCard key={file.id} file={file} />
              ))}
              <Link
                to={paths.app.newConnection.getHref()}
                className="flex min-h-65 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-edge-2 text-center hover:border-accent hover:bg-accent/2"
              >
                <Plus size={32} strokeWidth={1.5} className="text-ink-ghost" />
                <span className="text-sm font-medium text-ink-faint">
                  Add connection
                </span>
                <span className="max-w-45 text-xs text-ink-muted">
                  Connect to a live database or upload a DDL file
                </span>
              </Link>
            </div>

            {connectionsQuery.data && connectionsQuery.data.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={connectionsQuery.data.first}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-md border border-edge-2 px-3 py-1.5 text-xs font-medium text-ink-faint disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-mono text-xs text-ink-muted">
                  Page {connectionsQuery.data.page + 1} of{' '}
                  {connectionsQuery.data.totalPages}
                </span>
                <button
                  type="button"
                  disabled={connectionsQuery.data.last}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-md border border-edge-2 px-3 py-1.5 text-xs font-medium text-ink-faint disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Outlet />
    </>
  )
}

export default ConnectionsRoute
