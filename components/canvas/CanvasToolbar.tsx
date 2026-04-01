'use client'

import { useCanvas } from '@/lib/canvas/context'
import { useIconMode } from '@/lib/canvas/iconMode'
import type { ToolType, PortDirection } from '@/types/diagram'
import { SYSML_ICONS } from './SysMLSymbols'

const PORT_DIRECTIONS: { dir: PortDirection; symbol: string; title: string }[] = [
  { dir: 'in',    symbol: '<',  title: 'In — receives flow' },
  { dir: 'inout', symbol: '<>', title: 'InOut — bidirectional flow' },
  { dir: 'out',   symbol: '>',  title: 'Out — sends flow' },
]

interface ToolDef {
  tool: ToolType
  label: string
  emoji: string
  title: string
}

const tools: ToolDef[] = [
  { tool: 'pointer',     label: 'Pointer',    emoji: '👆', title: 'Select / Move' },
  { tool: 'package',     label: 'Package',    emoji: '📦', title: 'Add Package node' },
  { tool: 'block',       label: 'Block',      emoji: '🟩', title: 'Add Block node' },
  { tool: 'port',        label: 'FlowPort',   emoji: '⊠',  title: 'Add Flow Port (⊠)' },
  { tool: 'action',      label: 'Action',     emoji: '⚡', title: 'Add Action node' },
  { tool: 'association', label: 'Assoc',      emoji: '➖', title: 'Draw Association' },
  { tool: 'composition', label: 'Comp (*--)', emoji: '♦️', title: 'Draw Composition (*--)' },
  { tool: 'allocation',  label: 'Allocate',   emoji: '↗️', title: 'Draw Allocation (<<allocate>>)' },
  { tool: 'eraser',      label: 'Eraser',     emoji: '❌', title: 'Erase element or connection' },
]

interface Props {
  onClear: () => void
  onRecenter: () => void
}

function ToolIcon({ tool, emoji, isSysml, active }: { tool: string; emoji: string; isSysml: boolean; active: boolean }) {
  if (!isSysml) {
    return <span className="text-base leading-none">{emoji}</span>
  }
  const SvgIcon = SYSML_ICONS[tool]
  if (!SvgIcon) return <span className="text-base leading-none">{emoji}</span>
  return <SvgIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-600'}`} />
}

export default function CanvasToolbar({ onClear, onRecenter }: Props) {
  const { state, dispatch } = useCanvas()
  const { mode, toggle } = useIconMode()
  const isSysml = mode === 'sysml'

  return (
    <>
      {/* Desktop toolbar — vertical left strip */}
      <div className="hidden sm:flex flex-col border-r-2 border-zinc-200 bg-white w-[72px] flex-shrink-0 h-full">

        {/* Icon mode toggle — pinned top */}
        <div className="p-2 pb-1 flex-shrink-0">
          <button
            onClick={toggle}
            title={isSysml ? 'Switch to emoji icons' : 'Switch to SysML symbols'}
            className="w-full flex flex-col items-center gap-0.5 rounded px-1 py-1 text-[9px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors border border-zinc-300"
          >
            {isSysml ? (
              <>
                <span className="text-sm">🔣</span>
                <span>SysML</span>
              </>
            ) : (
              <>
                <span className="text-sm">😀</span>
                <span>Emoji</span>
              </>
            )}
          </button>
          <div className="border-t border-zinc-200 mt-1" />
        </div>

        {/* Scrollable tools list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2 flex flex-col gap-1">
          {tools.map((t) => {
            const active = state.currentTool === t.tool
            return (
              <div key={t.tool} className="flex flex-col gap-0.5">
                <button
                  title={t.title}
                  onClick={() => dispatch({ type: 'SET_TOOL', tool: t.tool })}
                  className={`
                    flex flex-col items-center gap-0.5 rounded px-1 py-1.5 text-[10px] leading-none transition-colors flex-shrink-0
                    ${active ? 'bg-[#1B1BFF] text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'}
                  `}
                >
                  <ToolIcon tool={t.tool} emoji={t.emoji} isSysml={isSysml} active={active} />
                  <span className="truncate w-full text-center">{t.label}</span>
                </button>

                {/* Direction submenu — visible only when FlowPort tool is active */}
                {t.tool === 'port' && active && (
                  <div className="flex flex-row justify-around px-1 pb-0.5 border-b border-zinc-200">
                    {PORT_DIRECTIONS.map(({ dir, symbol, title }) => (
                      <button
                        key={dir}
                        title={title}
                        onClick={() => dispatch({ type: 'SET_PORT_DIRECTION', direction: dir })}
                        className={`
                          flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition-colors
                          ${state.portDirection === dir
                            ? 'bg-[#1B1BFF] text-white'
                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'}
                        `}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Recenter + Clear — pinned bottom */}
        <div className="flex-shrink-0 p-2 pt-0 border-t border-zinc-200 flex flex-col gap-1">
          <button
            onClick={onRecenter}
            title="Reset zoom and pan to default"
            className="w-full flex flex-col items-center gap-0.5 rounded px-1 py-1.5 text-[10px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
          >
            <span className="text-base">⊙</span>
            <span>Recenter</span>
          </button>
          <button
            onClick={onClear}
            title="Clear canvas"
            className="w-full flex flex-col items-center gap-0.5 rounded px-1 py-1.5 text-[10px] text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <span className="text-base">🗑</span>
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Mobile toolbar — horizontal bottom strip */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-1 overflow-x-auto bg-white border-t-2 border-zinc-200 px-2 py-1.5 scrollbar-thin">

        {/* Mode toggle — leftmost */}
        <button
          onClick={toggle}
          title={isSysml ? 'Switch to emoji icons' : 'Switch to SysML symbols'}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 rounded px-2 py-1.5 min-w-[44px] min-h-[44px] justify-center text-[10px] border border-zinc-300 text-zinc-500"
        >
          <span className="text-lg">{isSysml ? '🔣' : '😀'}</span>
          <span>{isSysml ? 'SysML' : 'Emoji'}</span>
        </button>

        <div className="h-8 w-px bg-zinc-200 flex-shrink-0" />

        {tools.map((t) => {
          const active = state.currentTool === t.tool
          return (
            <div key={t.tool} className="flex-shrink-0 flex items-center gap-0.5">
              <button
                title={t.title}
                onClick={() => dispatch({ type: 'SET_TOOL', tool: t.tool })}
                className={`
                  flex-shrink-0 flex flex-col items-center gap-0.5 rounded px-2 py-1.5 min-w-[44px] min-h-[44px] text-[10px] justify-center transition-colors
                  ${active ? 'bg-[#1B1BFF] text-white' : 'text-zinc-500 hover:bg-zinc-100'}
                `}
              >
                <ToolIcon tool={t.tool} emoji={t.emoji} isSysml={isSysml} active={active} />
                <span>{t.label}</span>
              </button>

              {/* Direction sub-buttons — mobile, inline to the right of port button */}
              {t.tool === 'port' && active && (
                <div className="flex flex-col gap-0.5">
                  {PORT_DIRECTIONS.map(({ dir, symbol, title }) => (
                    <button
                      key={dir}
                      title={title}
                      onClick={() => dispatch({ type: 'SET_PORT_DIRECTION', direction: dir })}
                      className={`
                        flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-mono font-bold min-w-[28px] transition-colors
                        ${state.portDirection === dir
                          ? 'bg-[#1B1BFF] text-white'
                          : 'bg-zinc-100 text-zinc-600'}
                      `}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <button
          onClick={onRecenter}
          title="Reset zoom and pan to default"
          className="flex-shrink-0 flex flex-col items-center gap-0.5 rounded px-2 py-1.5 min-w-[44px] min-h-[44px] text-[10px] text-zinc-500 hover:bg-zinc-100 transition-colors justify-center"
        >
          <span className="text-lg">⊙</span>
          <span>Recenter</span>
        </button>
        <button
          onClick={onClear}
          className="flex-shrink-0 flex flex-col items-center gap-0.5 rounded px-2 py-1.5 min-w-[44px] min-h-[44px] text-[10px] text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors justify-center"
        >
          <span className="text-lg">🗑</span>
          <span>Clear</span>
        </button>
      </div>
    </>
  )
}
