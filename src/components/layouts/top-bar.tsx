import { ChevronDown } from 'lucide-react'

type TopBarProps = {
  title: string
  meta?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
}

export const TopBar = ({ title, meta, left, right }: TopBarProps) => {
  return (
    <div className="flex h-13 flex-none items-center justify-between border-b border-edge bg-surface px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-sans text-sm font-semibold text-ink">{title}</h1>
        {meta && <>{meta}</>}
        {left}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}

type ConnectionPillProps = {
  name: string
  onClick?: () => void
}

export const ConnectionPill = ({ name, onClick }: ConnectionPillProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-md border border-edge bg-surface-3 px-2.5 py-1 text-xs font-medium text-ink-faint"
  >
    <span className="size-2 rounded-full bg-accent" />
    {name}
    <ChevronDown size={12} className="text-ink-muted" />
  </button>
)
