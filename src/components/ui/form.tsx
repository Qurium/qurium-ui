import { zodResolver } from '@hookform/resolvers/zod'
import {
  type FieldValues,
  FormProvider,
  type Resolver,
  type SubmitHandler,
  useForm,
  useFormContext,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form'
import type { infer as Infer, ZodType } from 'zod'

import { cn } from '@/utils/cn'

type FormProps<TSchema extends ZodType<FieldValues>> = {
  onSubmit: SubmitHandler<Infer<TSchema>>
  schema: TSchema
  className?: string
  children: (methods: UseFormReturn<Infer<TSchema>>) => React.ReactNode
  options?: UseFormProps<Infer<TSchema>>
  id?: string
}

export const Form = <TSchema extends ZodType<FieldValues>>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TSchema>) => {
  const methods = useForm<Infer<TSchema>>({
    ...options,
    resolver: zodResolver(
      schema as ZodType<FieldValues, FieldValues>,
    ) as unknown as Resolver<Infer<TSchema>>,
  })

  return (
    <FormProvider {...methods}>
      <form
        className={cn('space-y-4', className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        id={id}
        noValidate
      >
        {children(methods)}
      </form>
    </FormProvider>
  )
}

export const Label = ({
  className,
  ...props
}: React.ComponentProps<'label'>) => (
  <label
    className={cn('block text-sm font-medium text-slate-700', className)}
    {...props}
  />
)

export const FieldError = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  if (!error) return null

  return (
    <p role="alert" className="mt-1 text-sm text-red-600">
      {String(error.message ?? 'Invalid value')}
    </p>
  )
}

export const Input = ({
  className,
  label,
  name,
  ...props
}: React.ComponentProps<'input'> & { label?: string; name: string }) => {
  const { register } = useFormContext()

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <input
        id={name}
        className={cn(
          'mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:ring-slate-500 focus:outline-none sm:text-sm',
          className,
        )}
        {...register(name)}
        {...props}
      />
      <FieldError name={name} />
    </div>
  )
}
