import { useMutation } from '@tanstack/react-query'
import * as z from 'zod'

import { api } from '@/lib/api-client'
import { queryClient } from '@/lib/react-query'
import type { User } from '@/types/api'

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(5, 'Required'),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export const login = (data: LoginInput): Promise<{ user: User }> => {
  return api.post('/auth/login', data)
}

type UseLoginOptions = {
  onSuccess?: (data: { user: User }) => void
}

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['authenticated-user'], data.user)
      onSuccess?.(data)
    },
  })
}
