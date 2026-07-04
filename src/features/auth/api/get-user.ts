import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { User } from '@/types/api'

export const getUser = (): Promise<User | null> => {
  return api.get('/auth/me')
}

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ['authenticated-user'],
    queryFn: getUser,
  })
}

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>
}

export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  })
}
