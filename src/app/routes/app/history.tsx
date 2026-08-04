import { Search } from 'lucide-react'
import { useState } from 'react'

import { TopBar } from '@/components/layouts/top-bar'
import { Spinner } from '@/components/ui/spinner'
import { useOnlineConnections } from '@/features/connections/api/get-connections'
import { useUploadedFiles } from '@/features/connections/api/get-uploaded-files'
import { useHistory } from '@/features/history/api/get-history'
import { HistoryDetail } from '@/features/history/components/history-detail'
import { HistoryList } from '@/features/history/components/history-list'
import { OwnerSelect } from '@/features/schema/components/owner-select'

const HistoryRoute = () => {
  const connectionsQuery = useOnlineConnections({ size: 100 })
  const filesQuery = useUploadedFiles({ size: 100 })

  const connections = connectionsQuery.data?.content ?? []
  const files = filesQuery.data?.content ?? []

  const [selectedOwnerId, setSelectedOwnerId] = useState<string | undefined>()
  const effectiveOwnerId = selectedOwnerId ?? connections[0]?.id ?? files[0]?.id

  const historyQuery = useHistory({ ownerId: effectiveOwnerId })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const entries = historyQuery.data?.content ?? []
  const selected = entries[selectedIndex] ?? entries[0]

  const ownerName =
    connections.find((c) => c.id === effectiveOwnerId)?.name ??
    files.find((f) => f.id === effectiveOwnerId)?.name ??
    ''

  if (historyQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-canvas">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <TopBar
        title="Query History"
        meta={
          <OwnerSelect
            connections={connections}
            files={files}
            selectedId={effectiveOwnerId}
            onSelect={(id) => {
              setSelectedOwnerId(id)
              setSelectedIndex(0)
            }}
          />
        }
        right={
          <>
            <div className="flex items-center gap-1.5 rounded-md border border-edge bg-surface-3 px-3 py-1.5">
              <Search size={13} className="text-ink-muted" />
              <span className="font-sans text-xs text-ink-muted">
                Search queries...
              </span>
            </div>
          </>
        }
      />

      <div className="animate-in fade-in flex flex-1 overflow-hidden duration-200">
        <HistoryList
          entries={entries}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        {selected && <HistoryDetail entry={selected} ownerName={ownerName} />}
      </div>
    </>
  )
}

export default HistoryRoute
