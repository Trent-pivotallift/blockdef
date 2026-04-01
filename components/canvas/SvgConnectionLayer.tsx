'use client'

import { useCanvas } from '@/lib/canvas/context'
import type { Connection, DiagramNode } from '@/types/diagram'
import { NODE_DIMS } from './DiagramNode'

const CONNECTION_STROKE: Record<string, string> = {
  association: '#71717a',
  composition: '#1B1BFF',
  allocation: '#7c3aed',
}

const CONNECTION_DASH: Record<string, string> = {
  association: 'none',
  composition: 'none',
  allocation: '6 3',
}

function getNodeCenter(node: DiagramNode) {
  const d = NODE_DIMS[node.type]
  // Package: node.y is top of the folder tab; body starts at node.y + tabH
  return {
    x: node.x + d.w / 2,
    y: node.y + d.tabH + d.h / 2,
  }
}

interface ConnLineProps {
  conn: Connection
  nodes: DiagramNode[]
  onDelete: (id: string) => void
  isEraser: boolean
}

function ConnLine({ conn, nodes, onDelete, isEraser }: ConnLineProps) {
  const src = nodes.find((n) => n.id === conn.sourceId)
  const tgt = nodes.find((n) => n.id === conn.targetId)
  if (!src || !tgt) return null

  const s = getNodeCenter(src)
  const t = getNodeCenter(tgt)
  const stroke = CONNECTION_STROKE[conn.type] ?? '#71717a'
  const dash = CONNECTION_DASH[conn.type] ?? 'none'

  // Composition: add diamond marker at source end
  const markerId = `marker-${conn.id}`

  return (
    <g>
      {/* Invisible wide hit area */}
      <line
        x1={s.x} y1={s.y} x2={t.x} y2={t.y}
        stroke="transparent"
        strokeWidth={12}
        style={{ cursor: isEraser ? 'crosshair' : 'pointer' }}
        onClick={() => onDelete(conn.id)}
      />
      {/* Visible line */}
      <line
        x1={s.x} y1={s.y} x2={t.x} y2={t.y}
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dash}
        markerEnd={conn.type === 'allocation' ? `url(#arrow)` : undefined}
        style={{ pointerEvents: 'none' }}
      />
      {/* Label */}
      <text
        x={(s.x + t.x) / 2}
        y={(s.y + t.y) / 2 - 5}
        fill="#9ca3af"
        fontSize={9}
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
      >
        {conn.type === 'composition' ? '*--' : conn.type === 'allocation' ? '<<allocate>>' : ''}
      </text>
    </g>
  )
}

export default function SvgConnectionLayer() {
  const { state, dispatch } = useCanvas()
  const isEraser = state.currentTool === 'eraser'

  function handleDelete(id: string) {
    if (isEraser) dispatch({ type: 'DELETE_CONNECTION', id })
  }

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7c3aed" />
        </marker>
      </defs>
      {/* Re-enable pointer events on the group for hit testing */}
      <g style={{ pointerEvents: 'all' }}>
        {state.connections.map((conn) => (
          <ConnLine
            key={conn.id}
            conn={conn}
            nodes={state.nodes}
            onDelete={handleDelete}
            isEraser={isEraser}
          />
        ))}
      </g>
    </svg>
  )
}
