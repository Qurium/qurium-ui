import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { historyEntries } from '../seed/history'

export const historyHandlers = [
  http.get(`${env.API_URL}/history`, () => {
    return HttpResponse.json(historyEntries)
  }),
]
