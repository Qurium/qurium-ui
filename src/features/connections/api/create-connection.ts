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
  return api.post('/connections', { ...data, port: Number(data.port) })
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

type TestConnectionInput = Pick<
  CreateConnectionInput,
  'type' | 'host' | 'port' | 'databaseName' | 'username' | 'password'
>

type TestConnectionResult = { isConnected: boolean }

export const testConnection = (
  data: TestConnectionInput,
): Promise<TestConnectionResult> =>
  api.post('/connections/test', { ...data, port: Number(data.port) })

export const useTestConnection = () =>
  useMutation({ mutationFn: testConnection })
