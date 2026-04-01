'use client'

import { useRef } from 'react'
import { useCanvas } from '@/lib/canvas/context'
import type { DiagramNode as DiagramNodeType, NodeType } from '@/types/diagram'
import { NODE_COLORS, NODE_LABELS, NODE_TEXT_COLORS, NODE_BORDER_COLORS } from '@/types/diagram'

// ── Shared node dimensions (also used by SvgConnectionLayer) ──────────────
export const NODE_DIMS: Record<NodeType, { tabH: number; w: number; h: number }> = {
  package: { tabH: 20, w: 140, h: 62 },
  block:   { tabH: 0,  w: 120, h: 52 },
  port:    { tabH: 0,  w: 14,  h: 14 },
  action:  { tabH: 0,  w: 120, h: 44 },
}
const PKG_TAB_W = 56  // folder tab width (package only)

interface Props { node: DiagramNodeType }

export default function DiagramNode({ node }: Props) {
  const { state, dispatch } = useCanvas()
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 })

  const isSelected      = state.selectedNodeId === node.id
  const isConnecting    = state.connectingFromId === node.id
  const isEraserMode    = state.currentTool === 'eraser'
  const isConnectionTool = ['association', 'composition', 'allocation'].includes(state.currentTool)

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    if (isEraserMode) { dispatch({ type: 'DELETE_NODE', id: node.id }); return }
    if (isConnectionTool) {
      if (!state.connectingFromId) dispatch({ type: 'BEGIN_CONNECTION', fromId: node.id })
      else dispatch({ type: 'COMPLETE_CONNECTION', toId: node.id, connectionType: state.currentTool as 'association' | 'composition' | 'allocation' })
      return
    }
    isDragging.current = false
    dragStart.current = { x: e.clientX, y: e.clientY, nodeX: node.x, nodeY: node.y }
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    dispatch({ type: 'SELECT_NODE', id: node.id })
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!(e.currentTarget as HTMLDivElement).hasPointerCapture(e.pointerId)) return
    isDragging.current = true
    dispatch({
      type: 'MOVE_NODE', id: node.id,
      x: dragStart.current.nodeX + (e.clientX - dragStart.current.x) / state.zoom,
      y: dragStart.current.nodeY + (e.clientY - dragStart.current.y) / state.zoom,
    })
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
  }

  const bg     = NODE_COLORS[node.type]
  const text   = NODE_TEXT_COLORS[node.type]
  const border = NODE_BORDER_COLORS[node.type]
  const accent = isSelected || isConnecting ? '#1B1BFF' : border
  const dims   = NODE_DIMS[node.type]

  const cursor = isEraserMode ? 'crosshair' : isConnectionTool ? 'cell' : 'grab'
  const shadow = isSelected || isConnecting
    ? '0 0 0 2px #1B1BFF, 0 4px 14px rgba(27,27,255,0.18)'
    : '0 1px 4px rgba(0,0,0,0.08)'

  // ── Package node: SysML folder-tab shape ──────────────────────────────
  if (node.type === 'package') {
    return (
      <div
        style={{ position: 'absolute', left: node.x, top: node.y, cursor, touchAction: 'none', userSelect: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Folder tab — top-left, no bottom border */}
        <div style={{
          width: PKG_TAB_W,
          height: dims.tabH,
          backgroundColor: bg,
          borderTop: `1.5px solid ${accent}`,
          borderLeft: `1.5px solid ${accent}`,
          borderRight: `1.5px solid ${accent}`,
          borderBottom: 'none',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }} />

        {/* Main package body */}
        <div style={{
          minWidth: dims.w,
          minHeight: dims.h,
          backgroundColor: bg,
          border: `1.5px solid ${accent}`,
          boxShadow: shadow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 12px',
          gap: 2,
        }}>
          <span style={{ fontSize: 9, fontStyle: 'italic', color: text, lineHeight: 1 }}>
            «{NODE_LABELS[node.type]}»
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: text, textAlign: 'center', lineHeight: 1.3, maxWidth: 160 }}>
            {node.name || '(unnamed)'}
          </span>
        </div>
      </div>
    )
  }

  // ── Block node: two-compartment rectangle ─────────────────────────────
  if (node.type === 'block') {
    return (
      <div
        style={{
          position: 'absolute', left: node.x, top: node.y,
          minWidth: dims.w, cursor, touchAction: 'none', userSelect: 'none',
          backgroundColor: bg, border: `1.5px solid ${accent}`,
          boxShadow: shadow,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Header compartment */}
        <div style={{
          borderBottom: `1px solid ${border}`, padding: '3px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, fontStyle: 'italic', color: text }}>«{NODE_LABELS[node.type]}»</span>
        </div>
        {/* Name compartment */}
        <div style={{ padding: '6px 10px', textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: text }}>{node.name || '(unnamed)'}</span>
        </div>
      </div>
    )
  }

  // ── Flow Port node: small square with direction arrow + external label ──
  if (node.type === 'port') {
    const dir = node.portDirection ?? 'inout'
    const dirSymbol = dir === 'in' ? '<' : dir === 'out' ? '>' : '<>'
    const dirFontSize = dir === 'inout' ? 5.5 : 7
    return (
      <div
        style={{
          position: 'absolute', left: node.x, top: node.y,
          cursor, touchAction: 'none', userSelect: 'none',
          display: 'flex', alignItems: 'center', gap: 5,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* 14×14 flow port square */}
        <div style={{
          width: 14, height: 14, flexShrink: 0,
          backgroundColor: bg,
          border: `1.5px solid ${accent}`,
          boxShadow: shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: dirFontSize, color: text, lineHeight: 1, fontFamily: 'monospace', fontWeight: 700 }}>
            {dirSymbol}
          </span>
        </div>
        {/* Port label — rendered outside the square */}
        {node.name && (
          <span style={{
            fontSize: 9, color: '#3f3f46', whiteSpace: 'nowrap',
            fontFamily: 'monospace', lineHeight: 1,
          }}>
            {node.name}
          </span>
        )}
      </div>
    )
  }

  // ── Action node: rounded rectangle ───────────────────────────────────
  return (
    <div
      style={{
        position: 'absolute', left: node.x, top: node.y,
        minWidth: dims.w, cursor, touchAction: 'none', userSelect: 'none',
        backgroundColor: bg, border: `1.5px solid ${accent}`,
        borderRadius: 20, boxShadow: shadow,
        padding: '6px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span style={{ fontSize: 9, fontStyle: 'italic', color: text }}>«action»</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: text, textAlign: 'center' }}>{node.name || '(unnamed)'}</span>
    </div>
  )
}
