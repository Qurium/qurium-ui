import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { AskQuestionResponse } from '../types'

export const askQuestion = (question: string): Promise<AskQuestionResponse> => {
  return api.post('/query/ask', { question })
}

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: askQuestion,
  })
}
