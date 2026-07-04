import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Form, Input } from '@/components/ui/form'
import { paths } from '@/config/paths'

import { registerInputSchema, useRegister } from '../api/register'

type RegisterFormProps = {
  onSuccess?: () => void
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirectTo = searchParams.get('redirectTo')

  const registerMutation = useRegister({
    onSuccess: () => {
      onSuccess?.()
      navigate(redirectTo ?? paths.app.dashboard.getHref())
    },
  })

  return (
    <Form
      schema={registerInputSchema}
      onSubmit={(values) => registerMutation.mutate(values)}
    >
      {() => (
        <>
          <Input label="First Name" name="firstName" />
          <Input label="Last Name" name="lastName" />
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            Register
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to={paths.auth.login.getHref(redirectTo)}
              className="underline"
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </Form>
  )
}
