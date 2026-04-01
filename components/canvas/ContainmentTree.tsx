'use client'

import { useCanvas } from '@/lib/canvas/context'
import type { NodeType } from '@/types/diagram'

const TREE_ICONS: Record<NodeType, string> = {
  package: '📦',
  block: '🟩',
  port: '🚪',
  action: '⚡',
}

const TREE_FOLDERS = [
  { label: 'Structure', types: ['package', 'block', 'port'] as NodeType[] },
  { label: 'Behavior', types: ['action'] as NodeType[] },
]

export default function ContainmentTree() {
  const { state, dispatch } = useCanvas()

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 bg-zinc-50">
        Containment
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1 bg-white">
        {TREE_FOLDERS.map((folder) => {
          const folderNodes = state.nodes.filter((n) => folder.types.includes(n.type))
          return (
            <div key={folder.label}>
              <div className="px-3 py-1 text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                <span>▸</span>
                {folder.label}
                <span className="ml-auto text-zinc-300">{folderNodes.length}</span>
              </div>
              {folderNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => dispatch({ type: 'SELECT_NODE', id: node.id })}
                  className={`
                    w-full text-left px-5 py-0.5 text-xs flex items-center gap-1.5 truncate transition-colors
                    ${state.selectedNodeId === node.id
                      ? 'bg-[#1B1BFF]/10 text-[#1B1BFF] font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }
                  `}
                >
                  <span className="text-[10px]">{TREE_ICONS[node.type]}</span>
                  <span className="truncate">{node.name || '(unnamed)'}</span>
                </button>
              ))}
            </div>
          )
        })}

        {state.nodes.length === 0 && (
          <div className="px-3 py-4 text-[10px] text-zinc-400 italic">
            No elements yet. Select a tool and click the canvas to add elements.
          </div>
        )}
      </div>
    </div>
  )
}
