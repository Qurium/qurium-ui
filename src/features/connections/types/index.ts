export type Connection = {
  id: string
  name: string
  type: string
  host: string
  port: number
  databaseName: string
  username: string
  tableCount: number
  isConnected: boolean
  createdAt: string
  updatedAt: string
}

export type UploadedFile = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  tableCount: number
  deletedAt: string | null
}
