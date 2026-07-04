import { useAuth } from '@/lib/auth'

const DashboardRoute = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">
        Welcome{user.data ? `, ${user.data.firstName}` : ''}
      </h1>
      <p className="text-slate-500">
        This is a placeholder dashboard. Build your app's features here.
      </p>
    </div>
  )
}

export default DashboardRoute
