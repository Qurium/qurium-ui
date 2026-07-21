export type ColumnReference = {
  table: string
  column: string
}

export type SchemaColumn = {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey: boolean
  isUnique: boolean
  default: string | null
  references: ColumnReference | null
}

export type SchemaIndex = {
  name: string
  columns: string[]
}

export type SchemaTable = {
  name: string
  rowCount: number
  columns: SchemaColumn[]
  indices: SchemaIndex[]
  position: { x: number; y: number }
}

export type Schema = {
  ownerId: string
  ownerName: string
  dialect: string
  tables: SchemaTable[]
}
