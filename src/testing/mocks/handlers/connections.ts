import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'
import type { CreateConnectionInput } from '@/features/connections/api/create-connection'
import type { Connection } from '@/features/connections/types'
import type { PaginatedResponse } from '@/types/api'

import { connections } from '../seed/connections'

const paginate = <T>(
  items: T[],
  page: number,
  size: number,
): PaginatedResponse<T> => {
  const start = page * size
  const content = items.slice(start, start + size)
  const totalPages = Math.max(Math.ceil(items.length / size), 1)

  return {
    content,
    page,
    size,
    numberOfElements: content.length,
    totalElements: items.length,
    totalPages,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
  }
}

export const connectionsHandlers = [
  http.get(`${env.API_URL}/connections`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 20)

    return HttpResponse.json(paginate(connections, page, size))
  }),

  http.post(`${env.API_URL}/connections`, async ({ request }) => {
    const body = (await request.json()) as CreateConnectionInput
    const now = new Date().toISOString()

    const connection: Connection = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type,
      host: body.host,
      port: Number(body.port),
      databaseName: body.databaseName,
      createdAt: now,
      updatedAt: now,
    }

    connections.push(connection)
    return HttpResponse.json(connection, { status: 201 })
  }),
]
