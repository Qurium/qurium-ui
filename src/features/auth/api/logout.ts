import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import { queryClient } from '@/lib/react-query'

export const logout = (): Promise<void> => {
  return api.post('/auth/logout')
}

type UseLogoutOptions = {
  onSuccess?: () => void
}

export const useLogout = ({ onSuccess }: UseLogoutOptions = {}) => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['authenticated-user'], null)
      onSuccess?.()
    },
  })
}
