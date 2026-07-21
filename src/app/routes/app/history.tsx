import { Search } from 'lucide-react'
import { useState } from 'react'

import { ConnectionPill, TopBar } from '@/components/layouts/top-bar'
import { Spinner } from '@/components/ui/spinner'
import { useSchema } from '@/features/schema/api/get-schema'
import { useHistory } from '@/features/history/api/get-history'
import { HistoryDetail } from '@/features/history/components/history-detail'
import { HistoryList } from '@/features/history/components/history-list'

const HistoryRoute = () => {
  const schemaQuery = useSchema()
  const historyQuery = useHistory()
  const [selectedId, setSelectedId] = useState<string>()

  const entries = historyQuery.data ?? []
  const selected =
    entries.find((entry) => entry.id === selectedId) ?? entries[0]

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
        right={
          <>
            {schemaQuery.data && (
              <ConnectionPill name={schemaQuery.data.ownerName} />
            )}
            <div className="flex items-center gap-1.5 rounded-md border border-edge bg-surface-3 px-3 py-1.5">
              <Search size={13} className="text-ink-muted" />
              <span className="font-sans text-xs text-ink-muted">
                Search queries...
              </span>
            </div>
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden bg-canvas">
        <HistoryList
          entries={entries}
          selectedId={selected?.id}
          onSelect={setSelectedId}
        />
        {selected && (
          <HistoryDetail
            entry={selected}
            connectionName={schemaQuery.data?.ownerName ?? ''}
          />
        )}
      </div>
    </>
  )
}

export default HistoryRoute
