import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Form, Input } from '@/components/ui/form'
import { paths } from '@/config/paths'

import { loginInputSchema, useLogin } from '../api/login'

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirectTo = searchParams.get('redirectTo')

  const loginMutation = useLogin({
    onSuccess: () => {
      onSuccess?.()
      navigate(redirectTo ?? paths.app.dashboard.getHref())
    },
  })

  return (
    <Form
      schema={loginInputSchema}
      onSubmit={(values) => loginMutation.mutate(values)}
    >
      {() => (
        <>
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            Log in
          </Button>
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to={paths.auth.register.getHref(redirectTo)}
              className="underline"
            >
              Register
            </Link>
          </p>
        </>
      )}
    </Form>
  )
}
