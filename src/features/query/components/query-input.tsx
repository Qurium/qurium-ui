import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

type QueryInputProps = {
  onSubmit: (question: string) => void
  disabled?: boolean
}

export const QueryInput = ({ onSubmit, disabled }: QueryInputProps) => {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim() || disabled) return
    onSubmit(value.trim())
    setValue('')
  }

  return (
    <div className="border-t border-edge px-5 py-4">
      <div className="flex items-center gap-2.5 rounded-lg border border-edge-2 bg-surface px-3.5 py-2.5">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              submit()
            }
          }}
          placeholder="Ask a question about your data..."
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <span className="rounded border border-edge-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-ghost">
          ⌘↩
        </span>
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send question"
          className="flex size-7.5 items-center justify-center rounded-md bg-linear-to-br from-accent to-blue disabled:opacity-40"
        >
          <ArrowRight size={14} className="text-canvas-rail" />
        </button>
      </div>
    </div>
  )
}
