import type { QueryResult } from '@/types/query-result'

export type HistoryEntry = {
  id: string
  question: string
  status: 'success' | 'failed'
  createdAt: string
  durationMs: number | null
  errorMessage: string | null
  sql: string | null
  explanation: string | null
  result: QueryResult | null
}
