'use client'

import { useState } from 'react'
import type { GradeResult } from '@/types/grading'

interface Props {
  result: GradeResult | null
  onSubmit: () => void
  isSubmitting: boolean
  uiActionsText: string
  onUiActionsChange: (text: string) => void
}

export default function ValidationConsole({ result, onSubmit, isSubmitting, uiActionsText, onUiActionsChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-t-2 border-zinc-200 bg-white flex-shrink-0">

      {/* Expanded panel — slides in above the bar */}
      {expanded && (
        <div className="border-b border-zinc-100 px-3 py-2 space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
          {/* Notes textarea */}
          <textarea
            value={uiActionsText}
            onChange={(e) => onUiActionsChange(e.target.value)}
            placeholder="Describe your Cameo UI actions (optional)..."
            rows={2}
            className="w-full resize-none rounded border-2 border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs text-zinc-700 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors mb-2"
          />
          {/* Feedback */}
          {result ? (
            result.feedback.map((f, i) => (
              <div
                key={i}
                className={`text-xs flex items-start gap-1.5 ${
                  f.type === 'error' ? 'text-red-500' : f.type === 'warning' ? 'text-amber-600' : 'text-green-600'
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {f.type === 'error' ? '✗' : f.type === 'warning' ? '⚠' : '✓'}
                </span>
                {f.message}
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 italic">Build your diagram, then submit to grade.</div>
          )}
        </div>
      )}

      {/* Always-visible single bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 hover:text-zinc-700 transition-colors flex-shrink-0"
          title={expanded ? 'Collapse console' : 'Expand console'}
        >
          <span className="text-[8px]">{expanded ? '▼' : '▲'}</span>
          Console
        </button>

        {/* Status pill */}
        <div className="flex-1 min-w-0">
          {result ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                result.passed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {result.passed ? '✓' : '✗'}
              {result.score}/{result.maxScore} — {result.passed ? 'Passed' : 'Try again'}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-400 italic">Ready to submit</span>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors whitespace-nowrap flex-shrink-0"
        >
          {isSubmitting ? 'Grading…' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
