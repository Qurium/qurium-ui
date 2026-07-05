import type { SchemaTable } from './types'

export const getForeignKeys = (table: SchemaTable) =>
  table.columns.filter((column) => column.references)

export const getReferencedBy = (table: SchemaTable, tables: SchemaTable[]) =>
  tables.flatMap((other) =>
    other.columns
      .filter((column) => column.references?.table === table.name)
      .map((column) => ({ table: other.name, column: column.name })),
  )
