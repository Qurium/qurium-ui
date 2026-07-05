import { http, HttpResponse, delay } from 'msw'

import { env } from '@/config/env'

import { answerQuestion } from '../seed/query'

export const queryHandlers = [
  http.post(`${env.API_URL}/query/ask`, async ({ request }) => {
    const { question } = (await request.json()) as { question: string }
    await delay(400)
    return HttpResponse.json(answerQuestion(question))
  }),
]
