'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import DiagramWorkspace from '@/components/canvas/DiagramWorkspace'
import ContactGateModal from '@/components/exercise/ContactGateModal'
import { getExercise } from '@/lib/exercises/definitions'

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.exerciseId as string

  const exercise = getExercise(slug)

  const [currentStage, setCurrentStage] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showGate, setShowGate] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!exercise) return
    if (!exercise.isFree) {
      const verified = localStorage.getItem('contact_verified') === 'true'
      if (!verified) {
        router.replace('/exercises')
      }
    }
  }, [exercise, router])

  if (!exercise) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-zinc-400" style={{ backgroundColor: '#F5F4F0' }}>
          Exercise not found.
        </div>
      </>
    )
  }

  function handleStagePass(score: number) {
    const newScore = totalScore + score
    setTotalScore(newScore)

    if (currentStage + 1 >= exercise!.stages.length) {
      setCompleted(true)
      return
    }

    const nextStage = currentStage + 1
    setCurrentStage(nextStage)

    if (exercise!.slug === 'deep-space-network' && nextStage >= exercise!.stages.length) {
      const verified = localStorage.getItem('contact_verified') === 'true'
      if (!verified) setShowGate(true)
    }
  }

  if (completed) {
    const maxScore = exercise.stages.length * 10
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ backgroundColor: '#F5F4F0' }}>
          <div className="text-5xl">🏆</div>
          <h1 className="text-2xl font-black text-zinc-950 text-center">Exercise Complete!</h1>
          <p className="text-zinc-500 text-center">
            {exercise.title} — Final Score:{' '}
            <span className="text-[#1B1BFF] font-bold">{totalScore}/{maxScore}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setCurrentStage(0); setTotalScore(0); setCompleted(false) }}
              className="rounded-full border-2 border-zinc-300 px-5 py-2.5 text-sm text-zinc-600 hover:border-zinc-500 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/exercises')}
              className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
            >
              More Exercises →
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {showGate && (
        <ContactGateModal
          onUnlock={() => {
            localStorage.setItem('contact_verified', 'true')
            setShowGate(false)
          }}
        />
      )}
      <div className="flex flex-col h-screen" style={{ backgroundColor: '#F5F4F0' }}>
        <Navbar />
        {/* Stage progress bar */}
        <div className="flex border-b-2 border-zinc-200 bg-white flex-shrink-0">
          {exercise.stages.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-1 transition-colors ${
                i < currentStage ? 'bg-[#1B1BFF]' : i === currentStage ? 'bg-[#1B1BFF]/40' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <DiagramWorkspace
            exerciseSlug={exercise.slug}
            stage={exercise.stages[currentStage]}
            totalScore={totalScore}
            stageIndex={currentStage}
            totalStages={exercise.stages.length}
            onStagePass={handleStagePass}
          />
        </div>
      </div>
    </>
  )
}
