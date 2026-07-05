import { describe, expect, it } from 'vitest'

import { renderApp, screen, waitFor } from '@/testing/test-utils'

import ConnectionsRoute from './connections'

describe('ConnectionsRoute', () => {
  it('renders the seeded connections', async () => {
    renderApp(<ConnectionsRoute />)

    await waitFor(() => {
      expect(screen.getByText('production-db')).toBeInTheDocument()
    })

    expect(screen.getByText('staging-db')).toBeInTheDocument()
    expect(screen.getByText('Add connection')).toBeInTheDocument()
  })
})
