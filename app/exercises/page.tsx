'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import ExerciseCard from '@/components/exercise/ExerciseCard'
import ContactGateModal from '@/components/exercise/ContactGateModal'
import { exercises } from '@/lib/exercises/definitions'

export default function ExercisesPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    setUnlocked(localStorage.getItem('contact_verified') === 'true')
  }, [])

  function handleUnlock() {
    localStorage.setItem('contact_verified', 'true')
    setUnlocked(true)
    setShowGate(false)
  }

  return (
    <>
      {showGate && <ContactGateModal onUnlock={handleUnlock} />}
      <Navbar />
      <main className="min-h-screen px-4 py-10" style={{ backgroundColor: '#F5F4F0' }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-zinc-950">SysML Exercises</h1>
            <p className="mt-2 text-zinc-500">
              Six real-world scenarios · Four diagram types each · OMG-standard grading
            </p>
          </div>

          {!unlocked && (
            <div className="mb-6 rounded-xl border-2 border-[#1B1BFF]/20 bg-[#1B1BFF]/5 px-4 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-700">
                <span className="font-semibold text-[#1B1BFF]">Exercises 1 &amp; 2 are free.</span>
                {' '}Unlock all 6 exercises with your email — takes 10 seconds.
              </p>
              <button
                onClick={() => setShowGate(true)}
                className="flex-shrink-0 rounded-full bg-[#1B1BFF] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#1010CC] transition-colors whitespace-nowrap"
              >
                Unlock All →
              </button>
            </div>
          )}

          {unlocked && (
            <div className="mb-6 rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700 font-medium">All 6 exercises unlocked.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exercises.map((ex, i) => (
              <ExerciseCard
                key={ex.slug}
                exercise={ex}
                locked={!unlocked && !ex.isFree}
                index={i}
                onUnlockClick={!unlocked && !ex.isFree ? () => setShowGate(true) : undefined}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
