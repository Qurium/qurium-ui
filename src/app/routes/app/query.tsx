import { useState } from 'react'

import { TopBar, ConnectionPill } from '@/components/layouts/top-bar'
import { Spinner } from '@/components/ui/spinner'
import { useSchema } from '@/features/schema/api/get-schema'
import { useAskQuestion } from '@/features/query/api/ask-question'
import { ChatThread } from '@/features/query/components/chat-thread'
import { QueryInput } from '@/features/query/components/query-input'
import type { ChatMessage } from '@/features/query/types'
import { cn } from '@/utils/cn'

const QueryRoute = () => {
  const schemaQuery = useSchema()
  const askQuestion = useAskQuestion()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedTable, setSelectedTable] = useState<string | undefined>(
    undefined,
  )

  const tables = schemaQuery.data?.tables ?? []
  const activeTable =
    tables.find((table) => table.name === selectedTable) ?? tables[0]

  const handleAsk = (question: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
    }
    const pendingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant-pending',
    }
    setMessages((prev) => [...prev, userMessage, pendingMessage])

    askQuestion.mutate(question, {
      onSuccess: (response) => {
        setMessages((prev) =>
          prev
            .filter((message) => message.id !== pendingMessage.id)
            .concat({
              id: crypto.randomUUID(),
              role: 'assistant',
              ...response,
            }),
        )
      },
      onError: () => {
        setMessages((prev) =>
          prev.filter((message) => message.id !== pendingMessage.id),
        )
      },
    })
  }

  return (
    <>
      <TopBar
        title="Query Console"
        meta={
          schemaQuery.data && (
            <ConnectionPill name={schemaQuery.data.connectionName} />
          )
        }
        right={
          schemaQuery.data && (
            <span className="font-sans text-xs text-ink-muted">
              Schema context: {schemaQuery.data.tables.length} tables loaded
            </span>
          )
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-60 flex-none overflow-y-auto border-r border-edge bg-canvas py-3">
          {schemaQuery.isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="px-3 pb-2 font-mono text-[10px] font-semibold tracking-widest text-ink-muted">
                TABLES
              </div>
              {tables.map((table) => {
                const isActive = table.name === activeTable?.name
                return (
                  <button
                    key={table.name}
                    type="button"
                    onClick={() => setSelectedTable(table.name)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-surface',
                      isActive && 'bg-accent/6',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-[11px] font-medium',
                        isActive ? 'text-accent' : 'text-ink-dim',
                      )}
                    >
                      {table.name}
                    </span>
                    <span className="flex-1" />
                    <span className="font-mono text-[9px] text-ink-ghost">
                      {table.columns.length}
                    </span>
                  </button>
                )
              })}

              {activeTable && (
                <>
                  <div className="mx-3 my-3 border-t border-edge" />
                  <div className="px-3 pb-2 font-mono text-[10px] font-semibold tracking-widest text-ink-muted">
                    SELECTED: {activeTable.name.toUpperCase()}
                  </div>
                  <div className="px-3">
                    {activeTable.columns.map((column) => (
                      <div
                        key={column.name}
                        className="flex items-center gap-1.5 py-1"
                      >
                        <span
                          className={cn(
                            'font-mono text-[11px]',
                            column.isPrimaryKey ? 'text-ink' : 'text-ink-dim',
                          )}
                        >
                          {column.name}
                        </span>
                        <span className="flex-1" />
                        <span className="font-mono text-[9px] text-ink-muted">
                          {column.type}
                          {!column.nullable ? ' · NOT NULL' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col border-l border-edge bg-canvas">
          <ChatThread
            messages={messages}
            connectionName={schemaQuery.data?.connectionName ?? 'your database'}
          />
          <QueryInput onSubmit={handleAsk} disabled={askQuestion.isPending} />
        </div>
      </div>
    </>
  )
}

export default QueryRoute
