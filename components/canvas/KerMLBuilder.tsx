'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useCanvas } from '@/lib/canvas/context'
import { getAutoPlacePosition } from '@/lib/canvas/autoplace'
import type { DiagramNode } from '@/types/diagram'

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'element'
}

export default function KerMLBuilder() {
  const { state, dispatch } = useCanvas()
  const [newBlockName, setNewBlockName] = useState('')
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)
  const [partName, setPartName] = useState('')

  const blocks = state.nodes.filter((n) => n.type === 'block')

  function getComposedParts(blockId: string): DiagramNode[] {
    return state.connections
      .filter((c) => c.type === 'composition' && c.sourceId === blockId)
      .map((c) => state.nodes.find((n) => n.id === c.targetId))
      .filter((n): n is DiagramNode => n != null)
  }

  function handleToggleExpand(blockId: string) {
    if (expandedBlockId === blockId) {
      setExpandedBlockId(null)
    } else {
      setExpandedBlockId(blockId)
      setPartName('')
    }
  }

  function addBlock() {
    const name = newBlockName.trim()
    if (!name) return
    const { x, y } = getAutoPlacePosition(blocks.length)
    dispatch({ type: 'ADD_NODE', node: { id: uuidv4(), type: 'block', name, x, y } })
    setNewBlockName('')
  }

  function addPart(parentId: string) {
    const name = partName.trim()
    if (!name) return

    // Reuse existing block if name matches (case-insensitive), else create new
    const existing = blocks.find((b) => b.name.toLowerCase() === name.toLowerCase())
    let targetId: string

    if (existing) {
      targetId = existing.id
    } else {
      targetId = uuidv4()
      const { x, y } = getAutoPlacePosition(blocks.length)
      dispatch({ type: 'ADD_NODE', node: { id: targetId, type: 'block', name, x, y } })
    }

    dispatch({
      type: 'ADD_CONNECTION',
      sourceId: parentId,
      targetId,
      connectionType: 'composition',
    })

    setPartName('')
  }

  const compositionCount = state.connections.filter((c) => c.type === 'composition').length

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-200 bg-zinc-50 flex-shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#1B1BFF]">KerML Builder</div>
        <div className="text-[9px] text-zinc-400 font-mono mt-0.5">Block Definition Diagram</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {/* Existing blocks */}
        {blocks.map((block) => {
          const parts = getComposedParts(block.id)
          const isExpanded = expandedBlockId === block.id

          return (
            <div key={block.id} className="rounded border border-zinc-200 overflow-hidden">
              {/* Block header row */}
              <div
                className="flex items-center gap-1 px-2 py-1.5 bg-zinc-50 cursor-pointer hover:bg-zinc-100 select-none"
                onClick={() => handleToggleExpand(block.id)}
              >
                <span className="text-[8px] text-zinc-400 font-mono w-2 flex-shrink-0">
                  {isExpanded ? '▾' : '▸'}
                </span>
                <span className="flex-1 text-[10px] font-mono min-w-0 truncate">
                  <span className="text-[#1B1BFF] font-bold">block def </span>
                  <span className="text-zinc-700">
                    {/^[a-zA-Z_]\w*$/.test(block.name) ? block.name : `'${block.name}'`}
                  </span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'DELETE_NODE', id: block.id })
                    if (expandedBlockId === block.id) setExpandedBlockId(null)
                  }}
                  title="Delete block"
                  className="text-[10px] text-zinc-300 hover:text-red-500 transition-colors px-0.5 flex-shrink-0"
                >
                  ×
                </button>
              </div>

              {/* Composed parts */}
              {parts.length > 0 && (
                <div className="bg-white border-t border-zinc-100 px-3 py-1 space-y-0.5">
                  {parts.map((part) => {
                    const conn = state.connections.find(
                      (c) => c.type === 'composition' && c.sourceId === block.id && c.targetId === part.id
                    )
                    return (
                      <div key={part.id} className="flex items-center gap-1 text-[9px] font-mono">
                        <span className="text-zinc-300 flex-shrink-0">│</span>
                        <span className="flex-1 text-zinc-500 truncate">
                          <span className="text-zinc-400">part </span>
                          <span className="text-zinc-600">{toId(part.name)}</span>
                          <span className="text-zinc-400"> : </span>
                          <span className="text-zinc-700">
                            {/^[a-zA-Z_]\w*$/.test(part.name) ? part.name : `'${part.name}'`}
                          </span>
                          <span className="text-zinc-300">;</span>
                        </span>
                        {conn && (
                          <button
                            onClick={() => dispatch({ type: 'DELETE_CONNECTION', id: conn.id })}
                            title="Remove composition"
                            className="text-zinc-200 hover:text-red-500 transition-colors px-0.5 flex-shrink-0"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add part inline form */}
              {isExpanded && (
                <div className="bg-blue-50 border-t border-zinc-200 px-2 py-2">
                  <div className="text-[9px] text-zinc-400 font-mono mb-1">
                    <span className="text-zinc-500">part _ : </span>
                    <span className="text-zinc-400 italic">block name</span>
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="block name"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPart(block.id)}
                      autoFocus
                      className="flex-1 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] text-zinc-900 focus:border-[#1B1BFF] focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => addPart(block.id)}
                      className="rounded bg-[#1B1BFF] px-2 py-0.5 text-[10px] text-white hover:bg-[#1010CC] transition-colors flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                  {/* Existing blocks as quick-pick */}
                  {blocks.filter((b) => b.id !== block.id && !parts.find((p) => p.id === b.id)).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {blocks
                        .filter((b) => b.id !== block.id && !parts.find((p) => p.id === b.id))
                        .map((b) => (
                          <button
                            key={b.id}
                            onClick={() => {
                              dispatch({
                                type: 'ADD_CONNECTION',
                                sourceId: block.id,
                                targetId: b.id,
                                connectionType: 'composition',
                              })
                            }}
                            title={`Add ${b.name} as part`}
                            className="rounded bg-white border border-zinc-200 px-1.5 py-0.5 text-[9px] font-mono text-zinc-600 hover:border-[#1B1BFF] hover:text-[#1B1BFF] transition-colors truncate max-w-[90px]"
                          >
                            {b.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Add block def row */}
        <div className="rounded border border-dashed border-zinc-300 overflow-hidden">
          <div className="px-2 pt-1.5 pb-0.5">
            <span className="text-[9px] font-mono text-[#1B1BFF] font-bold">block def </span>
            <span className="text-[9px] font-mono text-zinc-400 italic">new block…</span>
          </div>
          <div className="flex gap-1 px-2 pb-2">
            <input
              type="text"
              placeholder="block name"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBlock()}
              className="flex-1 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[10px] text-zinc-900 focus:border-[#1B1BFF] focus:outline-none min-w-0"
            />
            <button
              onClick={addBlock}
              className="rounded bg-[#1B1BFF] px-2 py-0.5 text-[10px] text-white hover:bg-[#1010CC] transition-colors flex-shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Footer: counts */}
      <div className="border-t border-zinc-200 px-3 py-1.5 flex-shrink-0 bg-zinc-50">
        <span className="text-[9px] font-mono text-zinc-400">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          {compositionCount > 0 && ` · ${compositionCount} composition${compositionCount !== 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  )
}
