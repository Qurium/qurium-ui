import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import type { QueryConfig } from '@/lib/react-query'

import type { Schema, SchemaColumn, SchemaTable } from '../types'

type RawColumn = { name: string; type: string; nullable: string }
type RawConstraint = {
  name: string
  type: string
  columns: string
  referencesTable: string
  referencesColumns: string
}
type RawIndex = { name: string; columns: string; unique: boolean }
type RawTable = {
  table: string
  columns: RawColumn[]
  primaryKeys?: string[]
  constraints?: RawConstraint[]
  indexes?: RawIndex[]
}
type RawSchemaDTO = {
  connectionId: string
  connectionName: string | null
  dialect: string | null
  schemaJson: RawTable[]
}

function transformSchema(raw: RawSchemaDTO): Schema {
  return {
    connectionId: raw.connectionId,
    connectionName: raw.connectionName ?? '',
    dialect: raw.dialect ?? '',
    tables: raw.schemaJson.map((t, i) => transformTable(t, i)),
  }
}

function transformTable(raw: RawTable, index: number): SchemaTable {
  const constraints = raw.constraints ?? []
  const indexes = raw.indexes ?? []

  const pkColumns = new Set<string>(raw.primaryKeys ?? [])

  const uniqueColumns = new Set<string>(
    indexes
      .filter((idx) => idx.unique && idx.name !== 'PRIMARY')
      .flatMap((idx) => idx.columns.split(',').map((c) => c.trim())),
  )

  const fkMap = new Map<string, { table: string; column: string }>()
  for (const constraint of constraints) {
    if (constraint.type === 'FOREIGN_KEY') {
      const fkCols = constraint.columns.split(',').map((c) => c.trim())
      const refCols = constraint.referencesColumns
        .split(',')
        .map((c) => c.trim())
      fkCols.forEach((col, i) => {
        fkMap.set(col, {
          table: constraint.referencesTable,
          column: refCols[i] ?? refCols[0],
        })
      })
    }
  }

  const columns: SchemaColumn[] = raw.columns.map((col) => ({
    name: col.name,
    type: col.type,
    nullable: col.nullable !== 'NO',
    isPrimaryKey: pkColumns.has(col.name),
    isUnique: uniqueColumns.has(col.name),
    default: null,
    references: fkMap.get(col.name) ?? null,
  }))

  const indices = indexes
    .filter((idx) => idx.name !== 'PRIMARY')
    .map((idx) => ({
      name: idx.name,
      columns: idx.columns.split(',').map((c) => c.trim()),
    }))

  return {
    name: raw.table,
    rowCount: 0,
    columns,
    indices,
    position: { x: (index % 4) * 320, y: Math.floor(index / 4) * 260 },
  }
}

export const getSchema = (connectionId: string): Promise<Schema> => {
  return (
    api.get(
      `/connections/${connectionId}/schema`,
    ) as unknown as Promise<RawSchemaDTO>
  ).then(transformSchema)
}

export type GetSchemaParams = {
  connectionId: string
}

export const getSchemaQueryOptions = ({ connectionId }: GetSchemaParams) => {
  return queryOptions({
    queryKey: ['schema', connectionId],
    queryFn: () => getSchema(connectionId),
  })
}

type UseSchemaOptions = {
  connectionId?: string
  queryConfig?: QueryConfig<typeof getSchemaQueryOptions>
}

export const useSchema = ({
  queryConfig,
  connectionId,
}: UseSchemaOptions = {}) => {
  return useQuery({
    ...getSchemaQueryOptions({ connectionId: connectionId ?? '' }),
    enabled: !!connectionId,
    ...queryConfig,
  })
}
