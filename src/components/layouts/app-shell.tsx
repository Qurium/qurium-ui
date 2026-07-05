import { Database, History, Network, Settings, Terminal } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { paths } from '@/config/paths'
import { cn } from '@/utils/cn'

const navItems = [
  { to: paths.app.schema.getHref(), label: 'Schema', icon: Database },
  { to: paths.app.query.getHref(), label: 'Query', icon: Terminal },
  { to: paths.app.connections.getHref(), label: 'Connections', icon: Network },
  { to: paths.app.history.getHref(), label: 'History', icon: History },
]

const railLinkClasses =
  'flex size-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink-dim'

type AppShellProps = {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-screen bg-canvas font-sans text-ink-dim">
      <nav
        aria-label="Primary"
        className="flex w-14 flex-none flex-col items-center gap-1 border-r border-edge bg-canvas-rail py-4"
      >
        <div className="mb-5 flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-accent to-blue font-mono text-sm font-bold text-canvas-rail">
          Q
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              cn(railLinkClasses, isActive && 'bg-accent/12 text-accent')
            }
          >
            <Icon size={20} strokeWidth={1.5} />
          </NavLink>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          className={cn(railLinkClasses, 'cursor-default opacity-50')}
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
