import { Outlet } from 'react-router-dom'

import { AppShell } from '@/components/layouts/app-shell'

const AppRoot = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export default AppRoot
