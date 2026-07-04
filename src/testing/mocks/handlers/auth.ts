import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { db } from '../db'

export const authHandlers = [
  http.get(`${env.API_URL}/auth/me`, () => {
    const user = db.users.find((u) => u.id === db.authenticatedUserId)
    return HttpResponse.json(user ?? null)
  }),

  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string }
    const user = db.users.find((u) => u.email === email)

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      )
    }

    db.authenticatedUserId = user.id
    return HttpResponse.json({ user })
  }),

  http.post(`${env.API_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      firstName: string
      lastName: string
    }

    const now = new Date().toISOString()
    const user = {
      id: crypto.randomUUID(),
      role: 'USER' as const,
      bio: '',
      ...body,
      createdAt: now,
      updatedAt: now,
    }

    db.users.push(user)
    db.authenticatedUserId = user.id
    return HttpResponse.json({ user })
  }),

  http.post(`${env.API_URL}/auth/logout`, () => {
    db.authenticatedUserId = null
    return HttpResponse.json({})
  }),
]
