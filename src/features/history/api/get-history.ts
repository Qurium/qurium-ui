import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/api'

import type { HistoryEntry } from '../types'

export const getHistory = (
  ownerId: string,
): Promise<PaginatedResponse<HistoryEntry>> => {
  return api.get(`/${ownerId}/query/history`)
}

export const getHistoryQueryOptions = (ownerId: string | undefined) => {
  return queryOptions({
    queryKey: ['history', ownerId] as const,
    queryFn: () => getHistory(ownerId!),
    enabled: !!ownerId,
  })
}

type UseHistoryOptions = {
  ownerId?: string
}

export const useHistory = ({ ownerId }: UseHistoryOptions = {}) => {
  return useQuery(getHistoryQueryOptions(ownerId))
}
