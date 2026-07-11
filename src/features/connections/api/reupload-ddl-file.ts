import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { UploadedFile } from '../types'

type ReuploadDdlFileInput = { file: File; name: string; id: string }

export const reuploadDdlFile = ({
  file,
  name,
  id,
}: ReuploadDdlFileInput): Promise<UploadedFile> => {
  const form = new FormData()
  form.append('file', file)
  form.append('name', name)
  return api.patch(`/uploaded-files/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const useReuploadDdlFile = ({
  onSuccess,
}: { onSuccess?: (file: UploadedFile) => void } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reuploadDdlFile,
    onSuccess: (file) => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] })
      onSuccess?.(file)
    },
  })
}
