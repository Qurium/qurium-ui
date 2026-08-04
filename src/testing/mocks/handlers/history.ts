import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { historyEntries } from '../seed/history'

export const historyHandlers = [
  http.get(`${env.API_URL}/:ownerId/query/history`, () => {
    return HttpResponse.json({
      content: historyEntries,
      page: 0,
      size: 20,
      numberOfElements: historyEntries.length,
      totalElements: historyEntries.length,
      totalPages: 1,
      first: true,
      last: true,
      empty: historyEntries.length === 0,
    })
  }),
]
