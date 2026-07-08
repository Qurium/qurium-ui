import { useCallback, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileCode, UploadCloud } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { paths } from '@/config/paths'
import {
  type CreateConnectionInput,
  createConnectionInputSchema,
  useCreateConnection,
  useTestConnection,
} from '@/features/connections/api/create-connection'
import { useUploadDdlFile } from '@/features/connections/api/upload-ddl-file'
import { cn } from '@/utils/cn'

const fieldClass =
  'mt-1 w-full rounded-md border border-edge-2 bg-canvas px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none'
const labelClass = 'text-xs font-medium text-ink-faint'
const errorClass = 'mt-1 text-xs text-amber'

type Tab = 'connection' | 'ddl'

const TABS: { id: Tab; label: string }[] = [
  { id: 'connection', label: 'Database connection' },
  { id: 'ddl', label: 'Upload DDL file' },
]

const DbConnectionForm = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateConnectionInput>({
    resolver: zodResolver(createConnectionInputSchema),
    defaultValues: { type: 'POSTGRES' },
  })

  const createConnection = useCreateConnection({ onSuccess: onClose })
  const testConn = useTestConnection()
  const type = watch('type') // eslint-disable-line react-hooks/incompatible-library

  const handleTest = async () => {
    const fields = ['type', 'host', 'port', 'databaseName'] as const
    const valid = await trigger(fields)
    if (!valid) return
    const { type, host, port, databaseName, username, password } = getValues()
    testConn.mutate({
      type,
      host,
      port,
      databaseName,
      ...(username ? { username } : {}),
      ...(password ? { password } : {}),
    })
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => createConnection.mutate(values))}
      className="flex flex-col gap-4 px-6 py-5"
    >
      <div>
        <label className={labelClass} htmlFor="name">
          Connection name
        </label>
        <input
          id="name"
          placeholder="my-database"
          className={fieldClass}
          {...register('name')}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <span className={labelClass}>Database type</span>
        <div className="mt-1 flex gap-2">
          {(
            [
              { value: 'POSTGRES', label: 'PostgreSQL' },
              { value: 'MYSQL', label: 'MySQL' },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex-1 cursor-pointer rounded-md border py-2 text-center text-xs font-medium',
                type === option.value
                  ? 'border-accent bg-accent/6 text-accent'
                  : 'border-edge-2 text-ink-muted',
              )}
            >
              <input
                type="radio"
                value={option.value}
                className="sr-only"
                {...register('type')}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass} htmlFor="host">
            Host
          </label>
          <input
            id="host"
            placeholder="localhost"
            className={fieldClass}
            {...register('host')}
          />
          {errors.host && <p className={errorClass}>{errors.host.message}</p>}
        </div>
        <div className="w-25">
          <label className={labelClass} htmlFor="port">
            Port
          </label>
          <input
            id="port"
            placeholder="5432"
            className={fieldClass}
            {...register('port')}
          />
          {errors.port && <p className={errorClass}>{errors.port.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="databaseName">
          Database name
        </label>
        <input
          id="databaseName"
          placeholder="mydb"
          className={fieldClass}
          {...register('databaseName')}
        />
        {errors.databaseName && (
          <p className={errorClass}>{errors.databaseName.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            placeholder="postgres"
            className={fieldClass}
            {...register('username')}
          />
          {errors.username && (
            <p className={errorClass}>{errors.username.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={fieldClass}
            {...register('password')}
          />
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-edge pt-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTest}
            disabled={testConn.isPending}
            className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted disabled:opacity-50"
          >
            {testConn.isPending ? 'Testing…' : 'Test connection'}
          </button>
          {testConn.isSuccess && (
            <span
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-medium',
                testConn.data.isConnected ? 'text-accent' : 'text-amber',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  testConn.data.isConnected ? 'bg-accent' : 'bg-amber',
                )}
              />
              {testConn.data.isConnected ? 'Connected' : 'Unreachable'}
            </span>
          )}
          {testConn.isError && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber">
              <span className="size-1.5 rounded-full bg-amber" />
              Unreachable
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createConnection.isPending}
            className="rounded-md bg-linear-to-br from-accent to-accent-2 px-5 py-2 text-xs font-medium text-canvas-rail disabled:opacity-50"
          >
            {createConnection.isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  )
}

const DdlUploadSection = ({ onClose }: { onClose: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const upload = useUploadDdlFile({ onSuccess: onClose })

  const accept = (f: File) => {
    setFile(f)
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''))
    upload.reset()
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
          onClick={onClose}
          className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!file || !name.trim() || upload.isPending}
          onClick={() => file && upload.mutate({ file, name: name.trim() })}
          className="rounded-md bg-linear-to-br from-violet to-violet/70 px-5 py-2 text-xs font-medium text-canvas-rail disabled:opacity-40"
        >
          {upload.isPending ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

const NewConnectionRoute = () => {
  const navigate = useNavigate()
  const close = () => navigate(paths.app.connections.getHref())
  const [tab, setTab] = useState<Tab>('connection')

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent
        className="max-w-[480px] border border-edge-2 bg-surface p-0 shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge px-6 pt-4 pb-0">
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold text-ink">New Connection</h2>
            <div className="flex gap-4">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'border-b-2 px-1 pb-2.5 text-xs font-medium transition-colors',
                    tab === t.id
                      ? t.id === 'connection'
                        ? 'border-accent text-accent'
                        : t.id === 'ddl'
                          ? 'border-violet text-violet'
                          : 'border-accent text-accent'
                      : 'border-transparent text-ink-muted hover:text-ink-faint',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <DialogClose className="mb-auto flex size-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-3 hover:text-ink focus:outline-none">
            ×
          </DialogClose>
        </div>

        {tab === 'connection' ? (
          <DbConnectionForm onClose={close} />
        ) : (
          <DdlUploadSection onClose={close} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NewConnectionRoute
