import * as Sentry from '@sentry/react'

export const initSentry = () => {
  if (!import.meta.env.PROD) return

  Sentry.init({
    dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  })
}
