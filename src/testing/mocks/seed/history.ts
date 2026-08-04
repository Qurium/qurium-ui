import type { HistoryEntry } from '@/features/history/types'

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString()

export const historyEntries: HistoryEntry[] = [
  {
    question: 'How many orders were placed last month?',
    status: 'SUCCESS',
    executedAt: minutesAgo(2),
    executionTimeMs: 12,
    rowsReturned: 1,
  },
  {
    question: 'What are the top 5 products by revenue?',
    status: 'SUCCESS',
    executedAt: minutesAgo(15),
    executionTimeMs: 45,
    rowsReturned: 5,
  },
  {
    question: 'Show me users who signed up this week',
    status: 'SUCCESS',
    executedAt: minutesAgo(60),
    executionTimeMs: 23,
    rowsReturned: 12,
  },
  {
    question: 'Average order value per month',
    status: 'FAILED',
    executedAt: minutesAgo(180),
    executionTimeMs: null,
    rowsReturned: null,
  },
  {
    question: 'List all payment methods used',
    status: 'SUCCESS',
    executedAt: minutesAgo(1500),
    executionTimeMs: 8,
    rowsReturned: 4,
  },
]
