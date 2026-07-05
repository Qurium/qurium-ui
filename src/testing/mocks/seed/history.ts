import type { HistoryEntry } from '@/features/history/types'

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString()

export const historyEntries: HistoryEntry[] = [
  {
    id: '1',
    question: 'How many orders were placed last month?',
    status: 'success',
    createdAt: minutesAgo(2),
    durationMs: 12,
    errorMessage: null,
    sql: `SELECT COUNT(*) AS order_count
FROM orders
WHERE created_at >= date_trunc('month',
  now() - interval '1 month')
AND created_at < date_trunc('month', now());`,
    explanation:
      'There were 247 orders placed in the last calendar month. The query uses date_trunc to get the first day of the previous month and filters up to the first day of the current month.',
    result: { columns: ['order_count'], rows: [[247]], durationMs: 12 },
  },
  {
    id: '2',
    question: 'What are the top 5 products by revenue?',
    status: 'success',
    createdAt: minutesAgo(15),
    durationMs: 45,
    errorMessage: null,
    sql: `SELECT p.name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 5;`,
    explanation:
      'Revenue is calculated by multiplying quantity by unit price across order_items, grouped by product and ranked highest first.',
    result: {
      columns: ['name', 'revenue'],
      rows: [
        ['Wireless Headphones', 48210],
        ['Standing Desk', 39875],
        ['Mechanical Keyboard', 27430],
        ['4K Monitor', 24190],
        ['Ergonomic Chair', 21050],
      ],
      durationMs: 45,
    },
  },
  {
    id: '3',
    question: 'Show me users who signed up this week',
    status: 'success',
    createdAt: minutesAgo(60),
    durationMs: 23,
    errorMessage: null,
    sql: `SELECT id, email, created_at
FROM users
WHERE created_at >= date_trunc('week', now())
ORDER BY created_at DESC;`,
    explanation: 'Filters users created since the start of the current week.',
    result: {
      columns: ['id', 'email', 'created_at'],
      rows: [
        ['a1b2', 'sam@example.com', '2026-07-03'],
        ['c3d4', 'lee@example.com', '2026-07-02'],
      ],
      durationMs: 23,
    },
  },
  {
    id: '4',
    question: 'Average order value per month',
    status: 'failed',
    createdAt: minutesAgo(180),
    durationMs: null,
    errorMessage: 'timeout',
    sql: null,
    explanation: null,
    result: null,
  },
  {
    id: '5',
    question: 'List all payment methods used',
    status: 'success',
    createdAt: minutesAgo(1500),
    durationMs: 8,
    errorMessage: null,
    sql: `SELECT DISTINCT method FROM payments;`,
    explanation: 'Returns the distinct set of payment methods recorded.',
    result: {
      columns: ['method'],
      rows: [['card'], ['paypal'], ['bank_transfer'], ['cash_on_delivery']],
      durationMs: 8,
    },
  },
]
