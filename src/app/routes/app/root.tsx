import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Spinner } from '@/components/ui/spinner'
import { paths } from '@/config/paths'
import { useAuth } from '@/lib/auth'

const AppRoot = () => {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  if (user.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`
    return <Navigate to={paths.auth.login.getHref(redirectTo)} replace />
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default AppRoot
