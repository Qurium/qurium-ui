import { useState } from 'react'

import { highlightSql } from '../utils/highlight-sql'

type SqlBlockProps = {
  sql: string
}

export const SqlBlock = ({ sql }: SqlBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="overflow-hidden rounded-md border border-edge-2">
      <div className="flex items-center justify-between border-b border-edge-2 bg-surface-2 px-3.5 py-1.5">
        <span className="font-mono text-[10px] font-medium tracking-wide text-ink-muted">
          GENERATED SQL
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-[10px] text-ink-ghost hover:text-ink-faint"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-surface px-3.5 py-2.5 font-mono text-xs leading-7 whitespace-pre-wrap">
        {highlightSql(sql)}
      </pre>
    </div>
  )
}
