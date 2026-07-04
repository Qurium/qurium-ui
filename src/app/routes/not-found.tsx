import { Link } from 'react-router-dom'

import { paths } from '@/config/paths'

const NotFoundRoute = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">404 - Not Found</h1>
      <Link to={paths.home.getHref()} className="text-slate-500 underline">
        Go back home
      </Link>
    </div>
  )
}

export default NotFoundRoute
