import { useMutation } from '@tanstack/react-query'
import * as z from 'zod'

import { api } from '@/lib/api-client'
import { queryClient } from '@/lib/react-query'
import type { User } from '@/types/api'

export const registerInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(5, 'Required'),
})

export type RegisterInput = z.infer<typeof registerInputSchema>

export const registerUser = (data: RegisterInput): Promise<{ user: User }> => {
  return api.post('/auth/register', data)
}

type UseRegisterOptions = {
  onSuccess?: (data: { user: User }) => void
}

export const useRegister = ({ onSuccess }: UseRegisterOptions = {}) => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['authenticated-user'], data.user)
      onSuccess?.(data)
    },
  })
}
