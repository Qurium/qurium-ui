import type { User } from '@/types/api'

const now = () => new Date().toISOString()

export const db = {
  users: [
    {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@qurium.dev',
      role: 'ADMIN',
      bio: 'Building Qurium.',
      createdAt: now(),
      updatedAt: now(),
    },
  ] as User[],

  authenticatedUserId: null as string | null,
}
