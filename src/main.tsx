import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/app'
import { env } from '@/config/env'
import { initSentry } from '@/lib/sentry'

import './index.css'

initSentry()

async function enableMocking() {
  if (!import.meta.env.DEV || !env.ENABLE_API_MOCKING) return

  const { worker } = await import('@/testing/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
