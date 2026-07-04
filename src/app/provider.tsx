import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { MainErrorFallback } from '@/components/errors/main-fallback'
import { Notifications } from '@/features/notifications/components/notifications'
import { queryClient } from '@/lib/react-query'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
