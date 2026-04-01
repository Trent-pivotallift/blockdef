'use client'

import { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useCanvas } from '@/lib/canvas/context'
import type { NodeType, DiagramNode as DiagramNodeType } from '@/types/diagram'
import DiagramNode, { NODE_DIMS } from './DiagramNode'
import SvgConnectionLayer from './SvgConnectionLayer'
import NameModal from './NameModal'

// Snap a port placement to the nearest block's edge within THRESHOLD pixels.
// Returns absolute (x, y) for the port top-left (port center = border point).
const PORT_SNAP_THRESHOLD = 30
function findNearestBlockEdge(
  px: number, py: number,
  nodes: DiagramNodeType[]
): { blockId: string; snapX: number; snapY: number } | null {
  const d = NODE_DIMS.block
  let best: { blockId: string; snapX: number; snapY: number; dist: number } | null = null

  for (const node of nodes) {
    if (node.type !== 'block') continue
    const bx = node.x, by = node.y
    const bw = node.width ?? d.w
    const bh = (node.height ?? d.h) + d.tabH

    // Nearest point on each of the 4 edges
    const candidates = [
      { nx: bx,      ny: Math.max(by, Math.min(by + bh, py)) }, // left
      { nx: bx + bw, ny: Math.max(by, Math.min(by + bh, py)) }, // right
      { nx: Math.max(bx, Math.min(bx + bw, px)), ny: by      }, // top
      { nx: Math.max(bx, Math.min(bx + bw, px)), ny: by + bh }, // bottom
    ]

    for (const { nx, ny } of candidates) {
      const dist = Math.hypot(px - nx, py - ny)
      if (dist < PORT_SNAP_THRESHOLD && (!best || dist < best.dist)) {
        // Center the 14×14 port square on the border point
        best = { blockId: node.id, snapX: nx - 7, snapY: ny - 7, dist }
      }
    }
  }

  return best ? { blockId: best.blockId, snapX: best.snapX, snapY: best.snapY } : null
}

const PLACEMENT_TOOLS: NodeType[] = ['package', 'block', 'port', 'action']
const FRAME_X = 24
const FRAME_Y = 40
const TAB_W = 260
const TAB_H = 36
const TAB_NOTCH = 12   // diagonal chamfer on bottom-right of header tab
const HANDLE_SIZE = 10  // square resize handle side length
const MIN_FRAME = 200

interface DiagramFrame {
  diagramKind: string
  modelKind: string
  name: string
}

interface Props {
  diagramFrame?: DiagramFrame
}

export default function CanvasArea({ diagramFrame }: Props) {
  const { state, dispatch } = useCanvas()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pendingPlacement, setPendingPlacement] = useState<{ type: NodeType; x: number; y: number } | null>(null)
  const [isPanning, setIsPanning] = useState(false)

  // Keep a ref to current state values for the wheel handler to avoid stale closure
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state })

  // Pan interaction ref (no state, mutated during drag)
  const pan = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false })

  // Resize interaction ref
  const resize = useRef({
    active: false,
    handle: 'se' as 'e' | 's' | 'se',
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  })

  // ── Wheel zoom centered on cursor ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { zoom, panX, panY } = stateRef.current
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      const newZoom = Math.max(0.2, Math.min(4, zoom * factor))
      const newPanX = mx / newZoom - mx / zoom + panX
      const newPanY = my / newZoom - my / zoom + panY
      dispatch({ type: 'SET_ZOOM', zoom: newZoom })
      dispatch({ type: 'SET_PAN', x: newPanX, y: newPanY })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [dispatch])

  // ── Canvas pointer: placement or pan ──
  function handleCanvasPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const tool = state.currentTool
    if (PLACEMENT_TOOLS.includes(tool as NodeType)) {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / state.zoom - state.panX
      const y = (e.clientY - rect.top) / state.zoom - state.panY
      setPendingPlacement({ type: tool as NodeType, x, y })
      return
    }
    if (tool === 'pointer') {
      pan.current = { active: true, startX: e.clientX, startY: e.clientY, startPanX: state.panX, startPanY: state.panY, moved: false }
      containerRef.current!.setPointerCapture(e.pointerId)
    }
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pan.current.active) return
    const dx = e.clientX - pan.current.startX
    const dy = e.clientY - pan.current.startY
    if (!pan.current.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      pan.current.moved = true
      setIsPanning(true)
    }
    if (pan.current.moved) {
      dispatch({ type: 'SET_PAN', x: pan.current.startPanX + dx / state.zoom, y: pan.current.startPanY + dy / state.zoom })
    }
  }

  function handleCanvasPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!pan.current.active) return
    containerRef.current!.releasePointerCapture(e.pointerId)
    if (!pan.current.moved) dispatch({ type: 'SELECT_NODE', id: null })
    pan.current.active = false
    pan.current.moved = false
    setIsPanning(false)
  }

  // ── Resize handle pointer events ──
  function startResize(e: React.PointerEvent<SVGRectElement>, handle: 'e' | 's' | 'se') {
    e.stopPropagation()
    resize.current = { active: true, handle, startX: e.clientX, startY: e.clientY, startW: state.frameW, startH: state.frameH }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onResizeMove(e: React.PointerEvent<SVGRectElement>) {
    if (!resize.current.active) return
    const dx = (e.clientX - resize.current.startX) / state.zoom
    const dy = (e.clientY - resize.current.startY) / state.zoom
    const h = resize.current.handle
    const newW = h !== 's' ? Math.max(MIN_FRAME, resize.current.startW + dx) : state.frameW
    const newH = h !== 'e' ? Math.max(MIN_FRAME, resize.current.startH + dy) : state.frameH
    dispatch({ type: 'RESIZE_FRAME', w: newW, h: newH })
  }

  function onResizeUp(e: React.PointerEvent<SVGRectElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId)
    resize.current.active = false
  }

  function handleNameConfirm(name: string) {
    if (!pendingPlacement) return

    let x = pendingPlacement.x
    let y = pendingPlacement.y
    let parentId: string | undefined

    if (pendingPlacement.type === 'port') {
      const snap = findNearestBlockEdge(pendingPlacement.x, pendingPlacement.y, state.nodes)
      if (snap) {
        x = snap.snapX
        y = snap.snapY
        parentId = snap.blockId
      }
    }

    dispatch({
      type: 'ADD_NODE',
      node: {
        id: uuidv4(),
        type: pendingPlacement.type,
        name,
        x,
        y,
        ...(pendingPlacement.type === 'port'
          ? { portDirection: state.portDirection, ...(parentId ? { parentId } : {}) }
          : {}),
      },
    })
    setPendingPlacement(null)
  }

  const fw = state.frameW
  const fh = state.frameH
  const hs = HANDLE_SIZE

  // Shared props for each SVGRectElement resize handle
  function makeHandleProps(handle: 'e' | 's' | 'se', cx: number, cy: number) {
    const cursor = handle === 'e' ? 'ew-resize' : handle === 's' ? 'ns-resize' : 'nwse-resize'
    return {
      x: cx - hs / 2,
      y: cy - hs / 2,
      width: hs,
      height: hs,
      rx: 2,
      fill: 'white',
      stroke: '#1B1BFF',
      strokeWidth: 1.5,
      style: { cursor, pointerEvents: 'all' } as React.CSSProperties,
      onPointerDown: (ev: React.PointerEvent<SVGRectElement>) => startResize(ev, handle),
      onPointerMove: onResizeMove,
      onPointerUp: onResizeUp,
    }
  }

  return (
    <div className="flex-1 relative overflow-hidden pb-12 sm:pb-0" style={{ backgroundColor: '#F5F4F0' }}>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        style={{
          cursor: PLACEMENT_TOOLS.includes(state.currentTool as NodeType)
            ? 'crosshair'
            : state.currentTool === 'eraser'
            ? 'cell'
            : isPanning ? 'grabbing' : 'grab',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${state.zoom}) translate(${state.panX}px, ${state.panY}px)`,
            transformOrigin: 'top left',
          }}
        >
          {/* Background dot grid */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill="#C8C5BC" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* ── SysML Diagram Frame ── */}
          {diagramFrame && (
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
            >
              {/* Main frame border */}
              <rect x={FRAME_X} y={FRAME_Y} width={fw} height={fh} fill="none" stroke="#3f3f46" strokeWidth={1.5} />

              {/* Header tab — notched rectangle in top-left corner of frame.
                  Path: start at top-left of frame, go right (TAB_W - notch),
                  diagonal down-right (notch), down to tab bottom, left to frame edge, up. */}
              <path
                d={`M${FRAME_X},${FRAME_Y} h${TAB_W - TAB_NOTCH} l${TAB_NOTCH},${TAB_NOTCH} v${TAB_H - TAB_NOTCH} H${FRAME_X} Z`}
                fill="#F5F4F0"
                stroke="#3f3f46"
                strokeWidth={1.5}
              />

              {/* Tab text: diagramKind */}
              <text x={FRAME_X + 8} y={FRAME_Y + 14}
                fontFamily="'JetBrains Mono','Fira Code',monospace" fontSize={10} fontWeight="700" fill="#3f3f46">
                {diagramFrame.diagramKind}
              </text>

              {/* Tab text: [modelKind] name */}
              <text x={FRAME_X + 8} y={FRAME_Y + 27}
                fontFamily="'JetBrains Mono','Fira Code',monospace" fontSize={9} fill="#71717a">
                [{diagramFrame.modelKind}] {diagramFrame.name}
              </text>

              {/* Resize handles — pointer-events re-enabled on this group only */}
              <g style={{ pointerEvents: 'all' }}>
                <rect {...makeHandleProps('e',  FRAME_X + fw,      FRAME_Y + fh / 2)} />
                <rect {...makeHandleProps('s',  FRAME_X + fw / 2,  FRAME_Y + fh)} />
                <rect {...makeHandleProps('se', FRAME_X + fw,      FRAME_Y + fh)} />
              </g>
            </svg>
          )}

          {/* Connection lines */}
          <SvgConnectionLayer />

          {/* Nodes */}
          {state.nodes.map((node) => (
            <DiagramNode key={node.id} node={node} />
          ))}

          {/* Connection-in-progress hint */}
          {state.connectingFromId && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#1B1BFF]/10 border border-[#1B1BFF]/30 px-3 py-1 text-xs text-[#1B1BFF] pointer-events-none">
              Click a target element to complete the connection
            </div>
          )}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-400 pointer-events-none select-none">
        {Math.round(state.zoom * 100)}%
      </div>

      {pendingPlacement && (
        <NameModal
          nodeType={pendingPlacement.type}
          onConfirm={handleNameConfirm}
          onCancel={() => setPendingPlacement(null)}
        />
      )}
    </div>
  )
}
