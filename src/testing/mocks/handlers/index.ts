import { connectionsHandlers } from './connections'
import { historyHandlers } from './history'
import { queryHandlers } from './query'
import { schemaHandlers } from './schema'

export const handlers = [
  ...schemaHandlers,
  ...connectionsHandlers,
  ...queryHandlers,
  ...historyHandlers,
]
