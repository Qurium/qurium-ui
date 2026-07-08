import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'
import type { PaginatedResponse } from '@/types/api'

import type { UploadedFile } from '../types'

const MIN_PAGE_SIZE = 1
const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 20

const clampPageSize = (size: number) =>
  Math.min(Math.max(size, MIN_PAGE_SIZE), MAX_PAGE_SIZE)

export type GetUploadedFilesParams = {
  page?: number
  size?: number
}

export const getUploadedFiles = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetUploadedFilesParams = {}): Promise<PaginatedResponse<UploadedFile>> => {
  return api.get('/uploaded-files', {
    params: { page, size: clampPageSize(size) },
  })
}

export const getUploadedFilesQueryOptions = ({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
}: GetUploadedFilesParams = {}) => {
  return queryOptions({
    queryKey: ['uploaded-files', { page, size }],
    queryFn: () => getUploadedFiles({ page, size }),
  })
}

type UseUploadedFilesOptions = GetUploadedFilesParams & {
  queryConfig?: QueryConfig<typeof getUploadedFilesQueryOptions>
}

export const useUploadedFiles = ({
  page,
  size,
  queryConfig,
}: UseUploadedFilesOptions = {}) => {
  return useQuery({
    ...getUploadedFilesQueryOptions({ page, size }),
    ...queryConfig,
  })
}
