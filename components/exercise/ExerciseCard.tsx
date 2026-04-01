import Link from 'next/link'
import type { ExerciseDefinition } from '@/types/exercise'

interface Props {
  exercise: ExerciseDefinition
  locked: boolean
  index: number
  onUnlockClick?: () => void
}

const DIFFICULTY_COLORS = {
  beginner: 'text-green-700 border-green-200 bg-green-50',
  intermediate: 'text-amber-700 border-amber-200 bg-amber-50',
  advanced: 'text-red-700 border-red-200 bg-red-50',
}

const DOMAIN_ICONS: Record<string, string> = {
  'IT Infrastructure': '🖥️',
  'Aerospace': '🚀',
  'Automotive': '🚗',
  'Medical / Safety-Critical': '🏥',
  'Aerospace / Electrical': '⚡',
  'Transportation / Safety-Critical': '🚂',
}

export default function ExerciseCard({ exercise, locked, index, onUnlockClick }: Props) {
  return (
    <div className={`rounded-xl border-2 bg-white flex flex-col gap-4 p-5 transition-all ${locked ? 'border-zinc-200 opacity-70' : 'border-zinc-200 hover:border-[#1B1BFF]/40 hover:shadow-sm'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{DOMAIN_ICONS[exercise.domain] ?? '📐'}</span>
          <span className="text-xs text-zinc-400 font-mono">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          {exercise.isFree && (
            <span className="rounded-full border border-[#1B1BFF]/30 bg-[#1B1BFF]/5 px-2 py-0.5 text-[10px] text-[#1B1BFF] font-semibold">
              FREE
            </span>
          )}
          {locked && <span className="text-sm">🔒</span>}
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_COLORS[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-zinc-950">{exercise.title}</h3>
        <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">{exercise.description}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {exercise.stages.map((s) => (
          <span key={s.index} className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500 uppercase tracking-wide font-mono">
            {s.diagramType}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        {locked ? (
          <button
            onClick={onUnlockClick}
            className="w-full rounded-full border-2 border-[#1B1BFF]/30 px-4 py-2.5 text-xs font-semibold text-[#1B1BFF] text-center hover:bg-[#1B1BFF]/5 transition-colors"
          >
            🔓 Unlock with email →
          </button>
        ) : (
          <Link
            href={`/exercises/${exercise.slug}`}
            className="block rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white text-center hover:bg-zinc-800 transition-colors"
          >
            Start Exercise →
          </Link>
        )}
      </div>
    </div>
  )
}
