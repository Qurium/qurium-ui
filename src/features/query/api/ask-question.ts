import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { AskQuestionResponse } from '../types'

export const askQuestion = ({
  ownerId,
  question,
}: {
  ownerId: string
  question: string
}): Promise<AskQuestionResponse> => {
  return api.post(`/${ownerId}/query`, { question })
}

export const useAskQuestion = () => {
  return useMutation({ mutationFn: askQuestion })
}
