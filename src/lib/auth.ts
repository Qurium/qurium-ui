import { useUser } from '@/features/auth/api/get-user'
import { useLogin } from '@/features/auth/api/login'
import { useLogout } from '@/features/auth/api/logout'
import { useRegister } from '@/features/auth/api/register'

export const useAuth = () => {
  const user = useUser()

  return {
    user,
    isAuthenticated: !!user.data,
    login: useLogin,
    register: useRegister,
    logout: useLogout,
  }
}
