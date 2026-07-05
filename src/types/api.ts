export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
}

export type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  numberOfElements: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

export type Entity<T> = {
  [K in keyof T]: T[K]
} & BaseEntity
