export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
}

export type Meta = {
  page: number
  total: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: Meta
}

export type Entity<T> = {
  [K in keyof T]: T[K]
} & BaseEntity

export type Role = 'ADMIN' | 'USER'

export type User = Entity<{
  firstName: string
  lastName: string
  email: string
  role: Role
  bio: string
}>
