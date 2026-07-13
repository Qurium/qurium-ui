import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { cn } from '@/utils/cn'
import {
  type UpdateConnectionInput,
  updateConnectionInputSchema,
} from '../api/update-connection'
import type { Connection } from '../types'
import { useTestConnection } from '../api/create-connection'

const fieldClass =
  'mt-1 w-full rounded-md border border-edge-2 bg-canvas px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none'
const labelClass = 'text-xs font-medium text-ink-faint'
const errorClass = 'mt-1 text-xs text-amber'

type EditConnectionFormProps = {
  connection: Connection
  isPending: boolean
  onSubmit: (data: UpdateConnectionInput) => void
  onCancel: () => void
}

export const EditConnectionForm = ({
  connection,
  isPending,
  onSubmit,
  onCancel,
}: EditConnectionFormProps) => {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<UpdateConnectionInput>({
    resolver: zodResolver(updateConnectionInputSchema),
    defaultValues: {
      name: connection.name,
      host: connection.host,
      port: String(connection.port),
      databaseName: connection.databaseName,
      username: connection.username,
    },
  })

  const testConn = useTestConnection()

  const handleTest = async () => {
    const valid = await trigger(['host', 'port', 'databaseName'])
    if (!valid) return
    const { host, port, databaseName, username, password } = getValues()
    testConn.mutate({
      type: connection.type as 'POSTGRES' | 'MYSQL' | 'ORACLE',
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
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-6 py-5"
    >
      <div>
        <label className={labelClass} htmlFor="edit-name">
          Connection name
        </label>
        <input
          id="edit-name"
          placeholder="my-database"
          className={fieldClass}
          {...register('name')}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass} htmlFor="edit-host">
            Host
          </label>
          <input
            id="edit-host"
            placeholder="localhost"
            className={fieldClass}
            {...register('host')}
          />
          {errors.host && <p className={errorClass}>{errors.host.message}</p>}
        </div>
        <div className="w-25">
          <label className={labelClass} htmlFor="edit-port">
            Port
          </label>
          <input
            id="edit-port"
            placeholder="5432"
            className={fieldClass}
            {...register('port')}
          />
          {errors.port && <p className={errorClass}>{errors.port.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="edit-databaseName">
          Database name
        </label>
        <input
          id="edit-databaseName"
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
          <label className={labelClass} htmlFor="edit-username">
            Username
          </label>
          <input
            id="edit-username"
            placeholder="postgres"
            className={fieldClass}
            {...register('username')}
          />
          {errors.username && (
            <p className={errorClass}>{errors.username.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className={labelClass} htmlFor="edit-password">
            Password
          </label>
          <input
            id="edit-password"
            type="password"
            placeholder="••••••••"
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
            onClick={onCancel}
            className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-linear-to-br from-accent to-accent-2 px-5 py-2 text-xs font-medium text-canvas-rail disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
