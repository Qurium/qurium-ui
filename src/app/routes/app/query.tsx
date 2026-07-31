import { useState } from 'react'

import { TopBar } from '@/components/layouts/top-bar'
import { useSchema } from '@/features/schema/api/get-schema'
import { useAskQuestion } from '@/features/query/api/ask-question'
import { ChatThread } from '@/features/query/components/chat-thread'
import { QueryInput } from '@/features/query/components/query-input'
import type { ChatMessage } from '@/features/query/types'
import { useUploadedFiles } from '@/features/connections/api/get-uploaded-files'
import { useOnlineConnections } from '@/features/connections/api/get-connections'
import { OwnerSelect } from '@/features/schema/components/owner-select'

const QueryRoute = () => {
  const askQuestion = useAskQuestion()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const connectionsQuery = useOnlineConnections({ size: 100 })
  const filesQuery = useUploadedFiles({ size: 100 })
  const connections = connectionsQuery.data?.content ?? []
  const files = filesQuery.data?.content ?? []

  const [selectedOwnerId, setSelectedOwnerId] = useState<string | undefined>(
    undefined,
  )
  const effectiveOwnerId = selectedOwnerId ?? connections[0]?.id ?? files[0]?.id

  const schemaQuery = useSchema({ ownerId: effectiveOwnerId })

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

    askQuestion.mutate(
      { ownerId: effectiveOwnerId ?? '', question },
      {
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
      },
    )
  }

  return (
    <>
      <TopBar
        title="Query Console"
        meta={
          <OwnerSelect
            connections={connections}
            files={files}
            selectedId={effectiveOwnerId}
            onSelect={(id) => {
              if (id === effectiveOwnerId) return
              setSelectedOwnerId(id)
              setMessages([])
            }}
          />
        }
        right={
          schemaQuery.data && (
            <span className="font-sans text-xs text-ink-faint">
              Schema context: {schemaQuery.data.tables.length} tables loaded
            </span>
          )
        }
      />
      <div className="animate-in fade-in flex flex-1 overflow-hidden duration-200">
        <div className="flex flex-1 flex-col border-l border-edge bg-canvas">
          <ChatThread
            messages={messages}
            connectionName={schemaQuery.data?.ownerName ?? 'your database'}
          />
          <QueryInput onSubmit={handleAsk} disabled={askQuestion.isPending} />
        </div>
      </div>
    </>
  )
}

export default QueryRoute
