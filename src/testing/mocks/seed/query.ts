import type { AskQuestionResponse } from '@/features/query/types'

const cannedResponses: { match: RegExp; response: AskQuestionResponse }[] = [
  {
    match: /orders?.*(last month|this month)/i,
    response: {
      explanation: 'Counting all orders from the last calendar month.',
      sql: `SELECT COUNT(*) AS order_count
FROM orders
WHERE created_at >= date_trunc('month',
  now() - interval '1 month')
AND created_at < date_trunc('month', now());`,
      result: { columns: ['order_count'], rows: [[247]], durationMs: 12 },
      executed: true,
      resultSnapshot: 'order_count: 247',
    },
  },
  {
    match: /top.*(products?|revenue)/i,
    response: {
      explanation:
        'Revenue is calculated by multiplying quantity by unit price across order_items, grouped by product and ranked highest first.',
      sql: `SELECT p.name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.name
ORDER BY revenue DESC
LIMIT 5;`,
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
      executed: true,
      resultSnapshot:
        'name: Wireless Headphones, revenue: 48210; name: Standing Desk, revenue: 39875; name: Mechanical Keyboard, revenue: 27430; name: 4K Monitor, revenue: 24190; name: Ergonomic Chair, revenue: 21050',
    },
  },
  {
    match: /users?.*(sign|register|joined)/i,
    response: {
      explanation: 'Filters users created since the start of the current week.',
      sql: `SELECT id, email, created_at
FROM users
WHERE created_at >= date_trunc('week', now())
ORDER BY created_at DESC;`,
      result: {
        columns: ['id', 'email', 'created_at'],
        rows: [
          ['a1b2', 'sam@example.com', '2026-07-03'],
          ['c3d4', 'lee@example.com', '2026-07-02'],
        ],
        durationMs: 23,
      },
      executed: true,
      resultSnapshot:
        'id: a1b2, email: sam@example.com, created_at: 2026-07-03; id: c3d4, email: lee@example.com, created_at: 2026-07-02',
    },
  },
]

const defaultResponse: AskQuestionResponse = {
  explanation:
    'Returning the row count for the closest matching table in your schema.',
  sql: `SELECT COUNT(*) AS total
FROM users;`,
  result: { columns: ['total'], rows: [[12847]], durationMs: 9 },
  executed: true,
  resultSnapshot: 'total: 12847',
}

export const answerQuestion = (question: string): AskQuestionResponse => {
  const match = cannedResponses.find((entry) => entry.match.test(question))
  return match?.response ?? defaultResponse
}
