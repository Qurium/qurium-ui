import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { PaginatedResponse } from '@/types/api'

import type { Connection } from '../types'

const MIN_PAGE_SIZE = 1
const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 20

const clampPageSize = (size: number) =>
  Math.min(Math.max(size, MIN_PAGE_SIZE), MAX_PAGE_SIZE)

export type GetConnectionsParams = {
  page?: number
  size?: number
}

export const getConnections = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetConnectionsParams = {}): Promise<PaginatedResponse<Connection>> => {
  return api.get('/connections', {
    params: { page, size: clampPageSize(size) },
  })
}

export const getOnlineConnections = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetConnectionsParams = {}): Promise<PaginatedResponse<Connection>> => {
  return api.get('/connections/online', {
    params: { page, size: clampPageSize(size) },
  })
}

export const getConnectionsQueryOptions = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetConnectionsParams = {}) => {
  return queryOptions({
    queryKey: ['connections', { page, size }],
    queryFn: () => getConnections({ page, size }),
  })
}

export const getOnlineConnectionsQueryOptions = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetConnectionsParams = {}) => {
  return queryOptions({
    queryKey: ['connections', 'online', { page, size }],
    queryFn: () => getOnlineConnections({ page, size }),
  })
}

type UseConnectionsOptions = GetConnectionsParams & {
  queryConfig?: QueryConfig<typeof getConnectionsQueryOptions>
}

type UseOnlineConnectionsOptions = GetConnectionsParams & {
  queryConfig?: QueryConfig<typeof getOnlineConnectionsQueryOptions>
}

export const useOnlineConnections = ({
  page,
  size,
  queryConfig,
}: UseOnlineConnectionsOptions = {}) => {
  return useQuery({
    ...getOnlineConnectionsQueryOptions({ page, size }),
    ...queryConfig,
  })
}

export const useConnections = ({
  page,
  size,
  queryConfig,
}: UseConnectionsOptions = {}) => {
  return useQuery({
    ...getConnectionsQueryOptions({ page, size }),
    ...queryConfig,
  })
}
