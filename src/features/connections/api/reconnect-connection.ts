import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api-client'

export const reconnectConnection = (id: string): Promise<void> =>
  api.patch(`/connections/${id}/reconnect`)

export const useReconnectConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reconnectConnection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })
}
