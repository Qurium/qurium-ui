import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'

const LandingRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-semibold">Qurium</h1>
      <p className="max-w-md text-slate-500">Sign in to get started.</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to={paths.auth.login.getHref()}>Log in</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={paths.auth.register.getHref()}>Register</Link>
        </Button>
      </div>
    </div>
  )
}

export default LandingRoute
