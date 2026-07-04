import { Link } from 'react-router-dom'

import { paths } from '@/config/paths'
import { useAuth } from '@/lib/auth'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth()
  const logoutMutation = logout()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <Link to={paths.app.dashboard.getHref()} className="font-semibold">
          Qurium
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {user.data?.firstName ?? 'Guest'}
          </span>
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-900"
            onClick={() => logoutMutation.mutate()}
          >
            Log out
          </button>
        </nav>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  )
}
