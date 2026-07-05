import type { Connection } from '@/features/connections/types'

const now = () => new Date().toISOString()

export const connections: Connection[] = [
  {
    id: '1',
    name: 'production-db',
    type: 'POSTGRES',
    host: 'db.prod.internal',
    port: 5432,
    databaseName: 'ecommerce',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: '2',
    name: 'staging-db',
    type: 'POSTGRES',
    host: 'db.staging.internal',
    port: 5432,
    databaseName: 'ecommerce_staging',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: '3',
    name: 'analytics-oracle',
    type: 'ORACLE',
    host: 'oracle.rds.aws',
    port: 1521,
    databaseName: 'analytics',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: '4',
    name: 'legacy-mysql-dump',
    type: 'MYSQL',
    host: 'legacy.internal',
    port: 3306,
    databaseName: 'legacy',
    createdAt: now(),
    updatedAt: now(),
  },
]
