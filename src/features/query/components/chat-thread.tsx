import { useEffect, useRef } from 'react'

import type { ChatMessage } from '../types'
import { SqlBlock } from './sql-block'

type ChatThreadProps = {
  messages: ChatMessage[]
  connectionName: string
}

export const ChatThread = ({ messages, connectionName }: ChatThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 py-6">
      {messages.length === 0 && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-3.5 flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-accent to-blue font-mono text-lg font-bold text-canvas-rail">
            Q
          </div>
          <p className="mb-1 text-base font-semibold text-ink">
            Ask anything about your data
          </p>
          <p className="text-xs text-ink-muted">
            Questions are translated to SQL and run against {connectionName}
          </p>
        </div>
      )}

      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-120 rounded-tl-xl rounded-tr-xl rounded-br-sm rounded-bl-xl border border-[#1a3548] bg-[#0f2a3a] px-3.5 py-2.5 text-sm leading-6 text-ink">
                {message.content}
              </div>
            </div>
          )
        }

        if (message.role === 'assistant-pending') {
          return (
            <div key={message.id} className="flex items-center gap-2">
              <div className="flex size-5.5 items-center justify-center rounded-md bg-linear-to-br from-accent to-blue font-mono text-[10px] font-bold text-canvas-rail">
                Q
              </div>
              <div className="flex gap-1">
                <span
                  className="size-1.5 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="size-1.5 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="size-1.5 animate-bounce rounded-full bg-accent"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          )
        }

        return (
          <div key={message.id} className="flex max-w-150 flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-5.5 items-center justify-center rounded-md bg-linear-to-br from-accent to-blue font-mono text-[10px] font-bold text-canvas-rail">
                Q
              </div>
              <span className="text-xs font-medium text-ink-faint">Qurium</span>
            </div>
            <p className="pl-7.5 text-sm leading-6 text-ink-dim">
              {message.explanation}
            </p>
            <div className="ml-7.5">
              <SqlBlock
                sql={message.sql}
                resultSnapshot={message.resultSnapshot}
              />
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
