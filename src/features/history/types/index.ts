export type NlQueryStatus = 'SUCCESS' | 'FAILED'

export type HistoryEntry = {
  question: string
  status: NlQueryStatus
  executedAt: string
  executionTimeMs: number | null
  rowsReturned: number | null
}
