import { mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineVitestConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/testing/setup-tests.ts'],
      css: true,
      exclude: ['**/node_modules/**', '**/e2e/**'],
    },
  }),
)
