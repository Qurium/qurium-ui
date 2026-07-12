import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

export const deleteConnection = (connectionId: string): Promise<void> =>
  api.delete(`/connections/${connectionId}`)

export const deleteUploadedFile = (fileId: string): Promise<void> =>
  api.delete(`/uploaded-files/${fileId}`)

export const useDeleteConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteConnection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })
}

export const useDeleteUploadedFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUploadedFile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] }),
  })
}
