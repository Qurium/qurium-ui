import { useEffect, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
} from '@xyflow/react'
import { Link2, Star } from 'lucide-react'

import type { SchemaTable } from '../types'
import { TableNode, type TableNodeType } from './table-node'

const NODE_WIDTH = 232
const HEADER_HEIGHT = 41
const ROW_HEIGHT = 27

const nodeTypes = { tableNode: TableNode }

const tableHeight = (table: SchemaTable) =>
  HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + 12

type ErdCanvasProps = {
  tables: SchemaTable[]
}

export const ErdCanvas = ({ tables }: ErdCanvasProps) => {
  const initialNodes: TableNodeType[] = useMemo(
    () =>
      tables.map((table) => ({
        id: table.name,
        type: 'tableNode',
        position: table.position,
        data: { table },
        width: NODE_WIDTH,
        height: tableHeight(table),
      })),
    [tables],
  )

  const positionByName = useMemo(
    () => new Map(tables.map((t) => [t.name, t.position])),
    [tables],
  )

  const initialEdges: Edge[] = useMemo(() => {
    const result: Edge[] = []
    for (const table of tables) {
      for (const column of table.columns) {
        if (!column.references) continue

        const sourcePos = positionByName.get(table.name)
        const targetPos = positionByName.get(column.references.table)
        const goesLeft = targetPos && sourcePos && targetPos.x < sourcePos.x

        result.push({
          id: `${table.name}.${column.name}`,
          source: table.name,
          target: column.references.table,
          sourceHandle: goesLeft ? 'left-source' : 'right-source',
          targetHandle: goesLeft ? 'right-target' : 'left-target',
          type: 'default',
          style: {
            stroke: '#00d4aa',
            strokeWidth: 1.5,
            strokeDasharray: '4 3',
            opacity: 0.6,
          },
        })
      }
    }
    return result
  }, [tables, positionByName])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])
  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  return (
    <div className="relative flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        style={
          { '--xy-background-color': 'rgb(11 14 20)' } as React.CSSProperties
        }
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={2}
          color="var(--color-edge)"
        />
        <Controls className="!border-edge !bg-surface-2 [&>button]:!border-edge [&>button]:!bg-surface-2 [&>button]:!text-ink-faint [&>button:hover]:!text-ink-dim" />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 rounded-md border border-edge bg-surface px-3.5 py-2">
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <Star size={10} className="text-amber" />
          Primary key
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <Link2 size={10} className="text-blue" />
          Foreign key
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <span className="h-0 w-6 border-t border-dashed border-accent" />
          Relationship
        </div>
      </div>
    </div>
  )
}
