import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

import type { UploadedFile } from '../types'

type UploadDdlFileInput = { file: File; name: string }

export const uploadDdlFile = ({
  file,
  name,
}: UploadDdlFileInput): Promise<UploadedFile> => {
  const form = new FormData()
  form.append('file', file)
  form.append('name', name)
  return api.post('/uploaded-files', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const useUploadDdlFile = ({
  onSuccess,
}: { onSuccess?: (file: UploadedFile) => void } = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDdlFile,
    onSuccess: (file) => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] })
      onSuccess?.(file)
    },
  })
}
