import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'

import type { Schema } from '../types'

export const getSchema = (): Promise<Schema> => {
  return api.get('/schema')
}

export const getSchemaQueryOptions = () => {
  return queryOptions({
    queryKey: ['schema'],
    queryFn: getSchema,
  })
}

type UseSchemaOptions = {
  queryConfig?: QueryConfig<typeof getSchemaQueryOptions>
}

export const useSchema = ({ queryConfig }: UseSchemaOptions = {}) => {
  return useQuery({
    ...getSchemaQueryOptions(),
    ...queryConfig,
  })
}
