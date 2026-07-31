import type { QueryResult } from '@/types/query-result'

export type AskQuestionResponse = {
  explanation: string
  sql: string
  result: QueryResult
  executed: boolean
  resultSnapshot: string | null
}

export type ChatMessage =
  | { id: string; role: 'user'; content: string }
  | ({ id: string; role: 'assistant' } & AskQuestionResponse)
  | { id: string; role: 'assistant-pending' }
