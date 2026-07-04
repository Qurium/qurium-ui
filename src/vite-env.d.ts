/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_ENABLE_API_MOCKING?: string
  readonly VITE_APP_URL?: string
  readonly VITE_APP_MOCK_API_PORT?: string
  readonly VITE_APP_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
