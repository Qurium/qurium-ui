import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { schema } from '../seed/schema'

export const schemaHandlers = [
  http.get(`${env.API_URL}/connections/:connectionId/schema`, () => {
    return HttpResponse.json(schema)
  }),
]
