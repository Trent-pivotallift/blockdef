'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { CanvasProvider, useCanvas } from '@/lib/canvas/context'
import { IconModeProvider } from '@/lib/canvas/iconMode'
import { gradeSubmission, deriveRubricFromDiagram } from '@/lib/grading/engine'
import { getRubric } from '@/lib/grading/rubrics'
import type { GradeResult, RubricDefinition } from '@/types/grading'
import type { StageDefinition } from '@/types/exercise'
import type { DiagramType } from '@/types/exercise'
import CanvasToolbar from './CanvasToolbar'
import CanvasArea from './CanvasArea'

const MODEL_KIND: Record<DiagramType, string> = {
  pkg: 'Package',
  bdd: 'Package',
  ibd: 'Block',
  act: 'Activity',
}
import ContainmentTree from './ContainmentTree'
import KerMLBuilder from './KerMLBuilder'
import SpecificationWindow from './SpecificationWindow'
import ValidationConsole from './ValidationConsole'

interface WorkspaceInnerProps {
  exerciseSlug: string
  stage: StageDefinition
  totalScore: number
  stageIndex: number
  totalStages: number
  onStagePass: (score: number) => void
}

function WorkspaceInner({ exerciseSlug, stage, totalScore, stageIndex, totalStages, onStagePass }: WorkspaceInnerProps) {
  const { state, dispatch } = useCanvas()
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)

  // Extract block names from required elements like "⬛ Block: Pump Motor"
  const suggestedBlockNames = stage.requiredElements
    .filter((el) => el.includes('Block:'))
    .map((el) => el.replace(/.*Block:\s*/, '').trim())
  const [uiActionsText, setUiActionsText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTree, setShowTree] = useState(false)
  const [showSpec, setShowSpec] = useState(false)
  const approvedRubricRef = useRef<RubricDefinition | null>(null)

  // Fetch the admin-saved approved diagram and derive the live rubric from it
  useEffect(() => {
    fetch(`/api/admin/approved-diagrams/${exerciseSlug}/${stageIndex}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.diagramJson) {
          approvedRubricRef.current = deriveRubricFromDiagram(data.diagramJson)
        }
      })
      .catch(() => {})
  }, [exerciseSlug, stageIndex])

  const handleSubmit = useCallback(async () => {
    // Prefer the live rubric derived from the admin-approved diagram; fall back to static rubrics.ts
    const rubric = approvedRubricRef.current ?? getRubric(exerciseSlug, stageIndex)
    if (!rubric) return

    setIsSubmitting(true)

    const input = {
      nodes: state.nodes.map((n) => ({ id: n.id, type: n.type, name: n.name })),
      connections: state.connections.map((c) => ({ type: c.type, sourceId: c.sourceId, targetId: c.targetId })),
      uiActionsText,
    }

    // Client-side grade for instant feedback
    const result = gradeSubmission(input, rubric)
    setGradeResult(result)
    setIsSubmitting(false)

    if (result.passed) {
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseSlug,
          stageIndex,
          diagramState: { nodes: state.nodes, connections: state.connections },
          uiActionsText,
        }),
      }).catch(console.error)

      setTimeout(() => {
        onStagePass(result.score)
        dispatch({ type: 'CLEAR_CANVAS' })
        setGradeResult(null)
        setUiActionsText('')
      }, 1800)
    }
  }, [state, uiActionsText, exerciseSlug, stageIndex, onStagePass, dispatch])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Stage header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-zinc-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-mono">Stage {stageIndex + 1}/{totalStages}</span>
          <span className="text-sm font-bold text-zinc-950">{stage.title}</span>
          <span className="hidden sm:inline rounded-full border-2 border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
            {stage.diagramType.toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-zinc-400 font-mono">Score: {totalScore}</div>
      </div>

      {/* Task prompt — always visible */}
      <div className="px-4 py-2.5 bg-white border-b border-zinc-200 flex-shrink-0">
        <div className="rounded-lg border-l-4 border-[#1B1BFF] bg-blue-50 px-3 py-2.5">
          <div className="text-xs font-bold text-[#1B1BFF] mb-1.5">{stage.taskPrompt}</div>
          <ul className="space-y-0.5">
            {stage.requiredElements.map((el, i) => (
              <li key={i} className="text-xs text-zinc-700 font-mono">{el}</li>
            ))}
          </ul>
        </div>
        <details className="mt-1.5">
          <summary className="cursor-pointer text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors select-none">
            Full instructions &amp; hints ▸
          </summary>
          <p className="mt-1 text-xs text-zinc-600 leading-relaxed">{stage.instructions}</p>
          {stage.hints.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {stage.hints.map((h, i) => (
                <li key={i} className="flex gap-1.5 text-xs text-zinc-500"><span className="text-[#1B1BFF]">💡</span>{h}</li>
              ))}
            </ul>
          )}
        </details>
      </div>

      {/* Three-pane layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel: KerML Builder (kerml mode) or Containment Tree (graphical mode) */}
        {stage.inputMode === 'kerml' ? (
          <div className="hidden sm:flex w-64 border-r-2 border-zinc-200 flex-col flex-shrink-0">
            <KerMLBuilder suggestedNames={suggestedBlockNames} />
          </div>
        ) : (
          <div className="hidden sm:flex w-44 border-r-2 border-zinc-200 flex-col flex-shrink-0">
            <ContainmentTree />
          </div>
        )}

        {/* Canvas + toolbar */}
        <div className="flex flex-1 min-w-0">
          <CanvasToolbar
            onClear={() => dispatch({ type: 'CLEAR_CANVAS' })}
            onRecenter={() => { dispatch({ type: 'SET_ZOOM', zoom: 1 }); dispatch({ type: 'SET_PAN', x: -12, y: -28 }) }}
          />
          <CanvasArea
            diagramFrame={{
              diagramKind: stage.diagramType,
              modelKind: MODEL_KIND[stage.diagramType],
              name: exerciseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            }}
          />
        </div>

        {/* Spec window */}
        <div className="hidden lg:flex w-44 border-l-2 border-zinc-200 flex-col flex-shrink-0">
          <SpecificationWindow />
        </div>
      </div>

      {/* Mobile drawers */}
      <div className="sm:hidden fixed top-20 right-2 z-30 flex flex-col gap-1">
        <button
          onClick={() => { setShowTree(!showTree); setShowSpec(false) }}
          className="rounded-lg bg-white border-2 border-zinc-200 px-2 py-1.5 text-xs text-zinc-600 shadow-sm"
        >
          {stage.inputMode === 'kerml' ? '≡' : '🌳'}
        </button>
        <button
          onClick={() => { setShowSpec(!showSpec); setShowTree(false) }}
          className="rounded-lg bg-white border-2 border-zinc-200 px-2 py-1.5 text-xs text-zinc-600 shadow-sm"
        >
          ✏️
        </button>
      </div>

      {showTree && (
        <div className="sm:hidden fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r-2 border-zinc-200 shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-zinc-200">
            <span className="text-sm font-bold text-zinc-950">
              {stage.inputMode === 'kerml' ? 'KerML Builder' : 'Containment'}
            </span>
            <button onClick={() => setShowTree(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
          </div>
          {stage.inputMode === 'kerml' ? <KerMLBuilder suggestedNames={suggestedBlockNames} /> : <ContainmentTree />}
        </div>
      )}

      {showSpec && (
        <div className="sm:hidden fixed top-0 right-0 bottom-0 z-40 w-56 bg-white border-l-2 border-zinc-200 shadow-xl">
          <div className="flex items-center justify-between p-3 border-b border-zinc-200">
            <span className="text-sm font-bold text-zinc-950">Specification</span>
            <button onClick={() => setShowSpec(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
          </div>
          <SpecificationWindow />
        </div>
      )}

      {/* Validation console */}
      <ValidationConsole
        result={gradeResult}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        uiActionsText={uiActionsText}
        onUiActionsChange={setUiActionsText}
      />
    </div>
  )
}

export default function DiagramWorkspace(props: WorkspaceInnerProps) {
  return (
    <IconModeProvider>
      <CanvasProvider>
        <WorkspaceInner {...props} />
      </CanvasProvider>
    </IconModeProvider>
  )
}
