import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

export const introspectConnection = (connectionId: string): Promise<void> =>
  api.post(`/connections/${connectionId}/schema/introspect`)

export const useIntrospectConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: introspectConnection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })
}
