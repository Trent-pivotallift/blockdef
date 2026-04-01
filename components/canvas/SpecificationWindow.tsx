'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCanvas } from '@/lib/canvas/context'
import { NODE_LABELS } from '@/types/diagram'
import { serializeToKerML } from '@/lib/canvas/serializer'

type Tab = 'spec' | 'kerml'

export default function SpecificationWindow() {
  const { state, dispatch } = useCanvas()
  const selectedNode = state.nodes.find((n) => n.id === state.selectedNodeId)
  const [editName, setEditName] = useState('')
  const [tab, setTab] = useState<Tab>('spec')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (selectedNode) setEditName(selectedNode.name)
  }, [selectedNode?.id])

  function handleRename() {
    if (!selectedNode || !editName.trim()) return
    dispatch({ type: 'RENAME_NODE', id: selectedNode.id, name: editName.trim() })
  }

  const kerml = serializeToKerML(state.nodes, state.connections)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(kerml).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }, [kerml])

  return (
    <div className="flex flex-col h-full">
      {/* Tab strip */}
      <div className="flex border-b border-zinc-200 bg-zinc-50 flex-shrink-0">
        <button
          onClick={() => setTab('spec')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            tab === 'spec'
              ? 'text-zinc-700 border-b-2 border-zinc-700 bg-white'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Spec
        </button>
        <button
          onClick={() => setTab('kerml')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            tab === 'kerml'
              ? 'text-[#1B1BFF] border-b-2 border-[#1B1BFF] bg-white'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          KerML
        </button>
      </div>

      {/* ── Spec tab ── */}
      {tab === 'spec' && (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 bg-white">
          {selectedNode ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">Type</label>
                <div className="mt-0.5 rounded bg-zinc-100 border border-zinc-200 px-2 py-1 text-xs text-zinc-700 font-mono">
                  «{NODE_LABELS[selectedNode.type]}»
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">Name</label>
                <div className="mt-0.5 flex gap-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    className="flex-1 rounded border-2 border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-[#1B1BFF] focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleRename}
                    className="rounded bg-[#1B1BFF] px-2 py-1 text-xs text-white hover:bg-[#1010CC] transition-colors"
                  >
                    ✓
                  </button>
                </div>
              </div>

              {selectedNode.type === 'port' && selectedNode.portDirection && (
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">Direction</label>
                  <div className="mt-0.5 rounded bg-zinc-100 border border-zinc-200 px-2 py-1 text-xs text-zinc-700 font-mono">
                    {selectedNode.portDirection}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">Position</label>
                <div className="mt-0.5 rounded bg-zinc-100 border border-zinc-200 px-2 py-1 text-xs text-zinc-500 font-mono">
                  x: {Math.round(selectedNode.x)}, y: {Math.round(selectedNode.y)}
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: 'DELETE_NODE', id: selectedNode.id })}
                className="mt-2 rounded border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Delete element
              </button>
            </div>
          ) : (
            <div className="text-[10px] text-zinc-400 italic">
              Select an element to view its properties.
            </div>
          )}

          {state.connections.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold mb-1">
                Connections ({state.connections.length})
              </div>
              {state.connections.map((conn) => {
                const src = state.nodes.find((n) => n.id === conn.sourceId)
                const tgt = state.nodes.find((n) => n.id === conn.targetId)
                return (
                  <div key={conn.id} className="text-[10px] text-zinc-600 py-0.5 truncate">
                    {src?.name ?? '?'} → {tgt?.name ?? '?'}
                    <span className="text-zinc-400 ml-1">({conn.type})</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── KerML tab ── */}
      {tab === 'kerml' && (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
          {/* Copy button */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-100 flex-shrink-0">
            <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-wide">
              SysMLv2 subset · read-only
            </span>
            <button
              onClick={handleCopy}
              disabled={!kerml}
              className="text-[9px] font-semibold rounded px-2 py-0.5 transition-colors disabled:opacity-30
                bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* KerML text */}
          <div className="flex-1 overflow-auto scrollbar-thin p-3">
            {kerml ? (
              <pre className="text-[10px] leading-relaxed font-mono text-zinc-700 whitespace-pre-wrap break-words">
                {kerml}
              </pre>
            ) : (
              <p className="text-[10px] text-zinc-400 italic">
                Add elements to the canvas to see the KerML representation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
