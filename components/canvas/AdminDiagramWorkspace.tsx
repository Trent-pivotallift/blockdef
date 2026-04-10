'use client'

import { useEffect, useState, useCallback } from 'react'
import { CanvasProvider, useCanvas } from '@/lib/canvas/context'
import { IconModeProvider } from '@/lib/canvas/iconMode'
import type { DiagramNode, Connection } from '@/types/diagram'
import CanvasToolbar from './CanvasToolbar'
import CanvasArea from './CanvasArea'
import ContainmentTree from './ContainmentTree'
import SpecificationWindow from './SpecificationWindow'

const MODEL_KIND: Record<string, string> = {
  pkg: 'Package',
  bdd: 'Package',
  ibd: 'Block',
  act: 'Activity',
}

interface AdminWorkspaceInnerProps {
  exerciseSlug: string
  stageIndex: number
  diagramType: string
  initialNodes: DiagramNode[]
  initialConnections: Connection[]
  diagramTitle: string
}

function AdminWorkspaceInner({
  exerciseSlug,
  stageIndex,
  diagramType,
  initialNodes,
  initialConnections,
  diagramTitle,
}: AdminWorkspaceInnerProps) {
  const { state, dispatch } = useCanvas()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Load the approved diagram into the canvas on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_DIAGRAM', nodes: initialNodes, connections: initialConnections })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/admin/approved-diagrams/${exerciseSlug}/${stageIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagramJson: { nodes: state.nodes, connections: state.connections },
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }, [state, exerciseSlug, stageIndex])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-zinc-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-xs text-zinc-400 hover:text-[#1B1BFF] transition-colors">
            ← Admin
          </a>
          <span className="text-zinc-300">|</span>
          <a href={`/exercises/${exerciseSlug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-[#1B1BFF] transition-colors">
            View Exercise ↗
          </a>
          <span className="text-zinc-300">|</span>
          <span className="text-sm font-bold text-zinc-950">{diagramTitle}</span>
          <span className="rounded-full border-2 border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
            {diagramType.toUpperCase()} · Stage {stageIndex}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">
            {state.nodes.length} nodes · {state.connections.length} connections
          </span>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#1B1BFF] text-white hover:bg-[#1010CC] disabled:opacity-50'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving…'
              : saveStatus === 'saved' ? '✓ Saved'
              : saveStatus === 'error' ? 'Error — retry'
              : 'Save Reference Solution'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex-shrink-0">
        <p className="text-xs text-amber-700">
          <strong>Admin mode:</strong> Edit this diagram to define the reference solution.
          Every node and connection here becomes a grading requirement for users.
          Saving updates the rubric immediately.
        </p>
      </div>

      {/* Three-pane canvas layout */}
      <div className="flex flex-1 min-h-0">
        <div className="hidden sm:flex w-44 border-r-2 border-zinc-200 flex-col flex-shrink-0">
          <ContainmentTree />
        </div>
        <div className="flex flex-1 min-w-0">
          <CanvasToolbar
            onClear={() => dispatch({ type: 'CLEAR_CANVAS' })}
            onRecenter={() => {
              dispatch({ type: 'SET_ZOOM', zoom: 1 })
              dispatch({ type: 'SET_PAN', x: -12, y: -28 })
            }}
          />
          <CanvasArea
            diagramFrame={{
              diagramKind: diagramType,
              modelKind: MODEL_KIND[diagramType] ?? 'Package',
              name: exerciseSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            }}
          />
        </div>
        <div className="hidden lg:flex w-44 border-l-2 border-zinc-200 flex-col flex-shrink-0">
          <SpecificationWindow />
        </div>
      </div>
    </div>
  )
}

export default function AdminDiagramWorkspace(props: AdminWorkspaceInnerProps) {
  return (
    <IconModeProvider>
      <CanvasProvider>
        <AdminWorkspaceInner {...props} />
      </CanvasProvider>
    </IconModeProvider>
  )
}
