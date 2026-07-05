import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { TopBar } from '@/components/layouts/top-bar'
import { paths } from '@/config/paths'
import {
  type CreateConnectionInput,
  createConnectionInputSchema,
  useCreateConnection,
} from '@/features/connections/api/create-connection'
import { cn } from '@/utils/cn'

const fieldClass =
  'mt-1 w-full rounded-md border border-edge-2 bg-canvas px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none'
const labelClass = 'text-xs font-medium text-ink-faint'
const errorClass = 'mt-1 text-xs text-amber'

const NewConnectionRoute = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateConnectionInput>({
    resolver: zodResolver(createConnectionInputSchema),
    defaultValues: { type: 'POSTGRES' },
  })
  const createConnection = useCreateConnection({
    onSuccess: () => navigate(paths.app.connections.getHref()),
  })
  const type = watch('type')

  return (
    <>
      <TopBar title="New Connection" />

      <div className="flex-1 overflow-y-auto bg-canvas p-8">
        <form
          noValidate
          onSubmit={handleSubmit((values) => createConnection.mutate(values))}
          className="mx-auto flex max-w-120 flex-col gap-4"
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
              {errors.host && (
                <p className={errorClass}>{errors.host.message}</p>
              )}
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
              {errors.port && (
                <p className={errorClass}>{errors.port.message}</p>
              )}
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

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-md border border-edge-2 px-4 py-2 text-xs font-medium text-ink-faint hover:border-ink-muted"
            >
              Test connection
            </button>
            <button
              type="submit"
              disabled={createConnection.isPending}
              className="rounded-md bg-linear-to-br from-accent to-accent-2 px-5 py-2 text-xs font-medium text-canvas-rail disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default NewConnectionRoute
