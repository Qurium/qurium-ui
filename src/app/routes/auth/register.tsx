import { RegisterForm } from '@/features/auth/components/register-form'

const RegisterRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold">Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterRoute
