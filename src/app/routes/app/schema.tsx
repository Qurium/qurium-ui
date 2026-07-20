import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Spinner } from '@/components/ui/spinner'
import { ConnectionPill, TopBar } from '@/components/layouts/top-bar'
import { paths } from '@/config/paths'
import { useSchema } from '@/features/schema/api/get-schema'
import { ErdCanvas } from '@/features/schema/components/erd-canvas'
import { SchemaList } from '@/features/schema/components/schema-list'
import { cn } from '@/utils/cn'

type ViewMode = 'diagram' | 'list'

const SchemaRoute = () => {
  const schemaQuery = useSchema({
    connectionId: '1a78401e-4a59-4f19-b011-3cdf36e1c1e6',
  })
  const [view, setView] = useState<ViewMode>('diagram')
  const [search, setSearch] = useState('')

  const tables = useMemo(() => {
    const all = schemaQuery.data?.tables ?? []
    if (!search.trim()) return all
    return all.filter((table) =>
      table.name.toLowerCase().includes(search.trim().toLowerCase()),
    )
  }, [schemaQuery.data, search])

  const withRelations = tables.filter(
    (table) =>
      table.columns.some((column) => column.references) ||
      (schemaQuery.data?.tables ?? []).some((other) =>
        other.columns.some((column) => column.references?.table === table.name),
      ),
  ).length

  if (schemaQuery.isLoading || !schemaQuery.data || !schemaQuery.data.tables) {
    return (
      <div className="flex flex-1 items-center justify-center bg-canvas">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <TopBar
        title="Schema Explorer"
        meta={<ConnectionPill name={schemaQuery.data.connectionName} />}
        left={
          <span className="ml-1 font-mono text-[11px] text-ink-faint">
            {schemaQuery.data.dialect} · {schemaQuery.data.tables.length} tables
          </span>
        }
        right={
          <>
            <div className="flex items-center gap-1.5 rounded-md border border-edge bg-surface-3 px-3 py-1.5">
              <Search size={13} className="text-ink-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tables..."
                className="w-40 bg-transparent font-sans text-xs text-ink-dim placeholder:text-faint-muted focus:outline-none"
              />
            </div>
            <Link
              to={paths.app.query.getHref()}
              className="rounded-md bg-linear-to-br from-accent to-accent-2 px-3.5 py-1.5 font-sans text-xs font-medium text-canvas-rail"
            >
              Ask a question
            </Link>
          </>
        }
      />

      <div className="flex h-11 flex-none items-center justify-between border-b border-edge bg-surface px-6">
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-edge">
            <button
              type="button"
              onClick={() => setView('diagram')}
              className={cn(
                'px-3 py-1.5 font-sans text-[11px] font-medium',
                view === 'diagram'
                  ? 'bg-accent/12 text-accent'
                  : 'bg-surface-3 text-ink-muted',
              )}
            >
              Diagram
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'border-l border-edge px-3 py-1.5 font-sans text-[11px] font-medium',
                view === 'list'
                  ? 'bg-accent/12 text-accent'
                  : 'bg-surface-3 text-ink-muted',
              )}
            >
              List
            </button>
          </div>
          <div className="flex gap-1.5">
            <span className="rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1 font-sans text-[10px] font-medium text-accent">
              All tables · {schemaQuery.data.tables.length}
            </span>
            <span className="rounded-full border border-violet/20 bg-violet/8 px-2.5 py-1 font-sans text-[10px] font-medium text-violet">
              With relations · {withRelations}
            </span>
            <span className="rounded-full border border-amber/20 bg-amber/8 px-2.5 py-1 font-sans text-[10px] font-medium text-amber">
              Standalone · {schemaQuery.data.tables.length - withRelations}
            </span>
          </div>
        </div>
      </div>

      <div
        key={view}
        className="animate-in fade-in flex flex-1 overflow-hidden duration-200"
      >
        {view === 'diagram' ? (
          <ErdCanvas tables={tables} />
        ) : (
          <SchemaList tables={tables} />
        )}
      </div>

      <div className="flex h-13 flex-none items-center gap-3 border-t border-edge bg-surface px-6">
        <Plus size={16} className="text-accent" />
        <Link
          to={paths.app.query.getHref()}
          className="flex-1 rounded-md border border-edge bg-canvas px-3.5 py-2 font-sans text-sm text-ink-muted"
        >
          Ask a question about your data...
        </Link>
        <span className="rounded border border-edge-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-ghost">
          ⌘K
        </span>
      </div>
    </>
  )
}

export default SchemaRoute
