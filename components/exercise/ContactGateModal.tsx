'use client'

import { useState } from 'react'

interface Props {
  onUnlock: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactGateModal({ onUnlock }: Props) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, role }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Something went wrong')
      }
      setStatus('success')
      localStorage.setItem('contact_verified', 'true')
      setTimeout(onUnlock, 1200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-2xl">
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-zinc-950">Unlocked!</h3>
            <p className="mt-2 text-sm text-zinc-500">Loading your next 4 exercises...</p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-black text-zinc-950 mb-1">Unlock 4 More Exercises</h2>
              <p className="text-sm text-zinc-500">
                Share your email to unlock advanced scenarios across automotive, medical, aerospace, and railway domains.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-full border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Work email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-full border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 focus:border-[#1B1BFF] focus:outline-none transition-colors"
              >
                <option value="">I am a... (optional)</option>
                <option value="mbse_engineer">MBSE Engineer</option>
                <option value="trainer">SysML Trainer / Instructor</option>
                <option value="student">Student / OCSMP Candidate</option>
                <option value="other">Other</option>
              </select>

              {status === 'error' && (
                <p className="text-sm text-red-500 px-2">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="rounded-full bg-[#1B1BFF] px-6 py-3 text-sm font-bold text-white hover:bg-[#1010CC] disabled:opacity-50 transition-colors"
              >
                {status === 'loading' ? 'Unlocking...' : 'Unlock 4 More Exercises →'}
              </button>

              <p className="text-center text-xs text-zinc-400">No spam. Unsubscribe any time.</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
