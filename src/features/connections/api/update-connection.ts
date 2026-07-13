import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'

import { api } from '@/lib/api-client'

import type { Connection } from '../types'

export const updateConnectionInputSchema = z.object({
  name: z.string().min(1, 'Required'),
  host: z.string().min(1, 'Required'),
  port: z.string().min(1, 'Required').regex(/^\d+$/, 'Must be a number'),
  databaseName: z.string().min(1, 'Required'),
  username: z.string().optional(),
  password: z.string().optional(),
})

export type UpdateConnectionInput = z.infer<typeof updateConnectionInputSchema>

export const updateConnection = (
  id: string,
  data: UpdateConnectionInput,
): Promise<Connection> => {
  const { username, password, ...rest } = data
  return api.put(`/connections/${id}`, {
    ...rest,
    port: Number(data.port),
    ...(username ? { username } : {}),
    ...(password ? { password } : {}),
  })
}

export const useUpdateConnection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConnectionInput }) =>
      updateConnection(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['connections'] }),
  })
}
