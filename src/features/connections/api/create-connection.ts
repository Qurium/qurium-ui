import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'

import { api } from '@/lib/api-client'

import type { Connection } from '../types'

export const createConnectionInputSchema = z.object({
  name: z.string().min(1, 'Required'),
  type: z.enum(['POSTGRES', 'MYSQL', 'ORACLE']),
  host: z.string().min(1, 'Required'),
  port: z.string().min(1, 'Required').regex(/^\d+$/, 'Must be a number'),
  databaseName: z.string().min(1, 'Required'),
  username: z.string().optional(),
  password: z.string().optional(),
})

export type CreateConnectionInput = z.infer<typeof createConnectionInputSchema>

export const createConnection = (
  data: CreateConnectionInput,
): Promise<Connection> => {
  const { username, password, ...rest } = data
  return api.post('/connections', {
    ...rest,
    port: Number(data.port),
    ...(username ? { username } : {}),
    ...(password ? { password } : {}),
  })
}

type UseCreateConnectionOptions = {
  onSuccess?: (connection: Connection) => void
}

export const useCreateConnection = ({
  onSuccess,
}: UseCreateConnectionOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createConnection,
    onSuccess: (connection) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      onSuccess?.(connection)
    },
  })
}

export const testConnectionInputSchema = createConnectionInputSchema.pick({
  type: true,
  host: true,
  port: true,
  databaseName: true,
  username: true,
  password: true,
})

export type TestConnectionInput = z.infer<typeof testConnectionInputSchema>

type TestConnectionResult = { isConnected: boolean }

export const testConnection = (
  data: TestConnectionInput,
): Promise<TestConnectionResult> =>
  api.post('/connections/test', { ...data, port: Number(data.port) })

export const useTestConnection = () =>
  useMutation({ mutationFn: testConnection })
