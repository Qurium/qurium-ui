import { type DefaultOptions, QueryClient } from '@tanstack/react-query'

export const queryConfig = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 60 * 1000,
  },
} satisfies DefaultOptions

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

export type ApiFnReturnType<
  FnType extends (...args: never[]) => Promise<unknown>,
> = Awaited<ReturnType<FnType>>

export type QueryConfig<T extends (...args: never[]) => unknown> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>
