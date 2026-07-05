import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'

import type { HistoryEntry } from '../types'

export const getHistory = (): Promise<HistoryEntry[]> => {
  return api.get('/history')
}

export const getHistoryQueryOptions = () => {
  return queryOptions({
    queryKey: ['history'],
    queryFn: getHistory,
  })
}

type UseHistoryOptions = {
  queryConfig?: QueryConfig<typeof getHistoryQueryOptions>
}

export const useHistory = ({ queryConfig }: UseHistoryOptions = {}) => {
  return useQuery({
    ...getHistoryQueryOptions(),
    ...queryConfig,
  })
}
