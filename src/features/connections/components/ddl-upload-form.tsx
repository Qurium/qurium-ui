import { useCallback, useRef, useState } from 'react'
import { FileCode, UploadCloud } from 'lucide-react'

import { cn } from '@/utils/cn'

const fieldClass =
  'mt-1 w-full rounded-md border border-edge-2 bg-canvas px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none'
const labelClass = 'text-xs font-medium text-ink-faint'

type DdlUploadFormProps = {
  initialName?: string
  isPending: boolean
  onSubmit: (data: { file: File; name: string }) => void
  onCancel: () => void
}

export const DdlUploadForm = ({
  initialName = '',
  isPending,
  onSubmit,
  onCancel,
}: DdlUploadFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState(initialName)

  const accept = (f: File) => {
    setFile(f)
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''))
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) accept(dropped)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (picked) accept(picked)
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <input
        ref={inputRef}
        type="file"
        accept=".sql,.ddl,.txt"
        className="sr-only"
        onChange={onFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors',
          isDragging
            ? 'border-violet bg-violet/5'
            : file
              ? 'border-violet/40 bg-violet/3'
              : 'border-edge-2 hover:border-violet/40 hover:bg-violet/3',
        )}
      >
        {file ? (
          <>
            <div className="flex size-11 items-center justify-center rounded-lg bg-surface-3">
              <FileCode size={22} strokeWidth={1.3} className="text-violet" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">{file.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
                {(file.size / 1024).toFixed(1)} KB · click to replace
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex size-11 items-center justify-center rounded-lg bg-surface-3">
              <UploadCloud
                size={22}
                strokeWidth={1.3}
                className="text-ink-muted"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">
                Drop your DDL file here
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                or click to browse · .sql, .ddl, .txt
              </p>
            </div>
          </>
        )}
      </button>

      <div>
        <label className={labelClass} htmlFor="ddl-name">
          Name
        </label>
        <input
          id="ddl-name"
          placeholder="my-schema"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-edge pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!file || !name.trim() || isPending}
          onClick={() => file && onSubmit({ file, name: name.trim() })}
          className="rounded-md bg-linear-to-br from-violet to-violet/70 px-5 py-2 text-xs font-medium text-canvas-rail disabled:opacity-40"
        >
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
