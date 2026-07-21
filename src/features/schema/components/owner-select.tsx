import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Database, FileCode } from 'lucide-react'

import { cn } from '@/utils/cn'
import type { Connection, UploadedFile } from '@/features/connections/types'

type OwnerSelectProps = {
  connections: Connection[]
  files: UploadedFile[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}

export const OwnerSelect = ({
  connections,
  files,
  selectedId,
  onSelect,
}: OwnerSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedName =
    connections.find((c) => c.id === selectedId)?.name ??
    files.find((f) => f.id === selectedId)?.name ??
    'Select source...'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-edge bg-surface-3 px-2.5 py-1 text-xs font-medium text-ink-faint"
      >
        <span className="size-2 rounded-full bg-accent" />
        {selectedName}
        <ChevronDown
          size={12}
          className={cn(
            'text-ink-muted transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-md border border-edge bg-surface shadow-lg">
          {connections.length > 0 && (
            <div>
              <div className="px-3 pb-1 pt-2 font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
                CONNECTIONS
              </div>
              {connections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onSelect(c.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs hover:bg-surface-2',
                    c.id === selectedId ? 'text-accent' : 'text-ink-faint',
                  )}
                >
                  <Database size={12} className="shrink-0" />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div
              className={cn(connections.length > 0 && 'border-t border-edge')}
            >
              <div className="px-3 pb-1 pt-2 font-mono text-[10px] font-semibold tracking-wide text-ink-muted">
                UPLOADED FILES
              </div>
              {files.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelect(f.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs hover:bg-surface-2',
                    f.id === selectedId ? 'text-accent' : 'text-ink-faint',
                  )}
                >
                  <FileCode size={12} className="shrink-0" />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {connections.length === 0 && files.length === 0 && (
            <div className="px-3 py-4 text-center font-mono text-[11px] text-ink-muted">
              No sources available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
