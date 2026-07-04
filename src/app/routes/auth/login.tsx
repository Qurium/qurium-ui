import { LoginForm } from '@/features/auth/components/login-form'

const LoginRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">Log in</h1>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginRoute
