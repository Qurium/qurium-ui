import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderApp, screen, waitFor } from '@/testing/test-utils'

import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('logs the seeded user in and calls onSuccess', async () => {
    const user = userEvent.setup()
    let succeeded = false

    renderApp(<LoginForm onSuccess={() => (succeeded = true)} />)

    await user.type(screen.getByLabelText('Email'), 'jane.doe@qurium.dev')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(succeeded).toBe(true)
    })
  })

  it('shows a field error when the email is invalid', async () => {
    const user = userEvent.setup()
    renderApp(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email')
  })
})
