'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistForm() {
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
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-zinc-950">You&apos;re on the list!</h3>
        <p className="mt-2 text-zinc-500 text-sm">
          We&apos;ll notify you when new exercises drop and when trainer features launch.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-1 rounded-full border-2 border-zinc-300 bg-[#F5F4F0] px-5 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
        />
        <input
          type="email"
          placeholder="Work email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-full border-2 border-zinc-300 bg-[#F5F4F0] px-5 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
        />
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="rounded-full border-2 border-zinc-300 bg-[#F5F4F0] px-5 py-3 text-sm text-zinc-500 focus:border-[#1B1BFF] focus:outline-none transition-colors"
      >
        <option value="">I am a... (optional)</option>
        <option value="mbse_engineer">MBSE Engineer</option>
        <option value="trainer">SysML Trainer / Instructor</option>
        <option value="student">Student / OCSMP Candidate</option>
        <option value="other">Other</option>
      </select>

      {status === 'error' && (
        <p className="text-sm text-red-500 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !email}
        className="rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
      </button>

      <p className="text-center text-xs text-zinc-400">No spam. Unsubscribe any time.</p>
    </form>
  )
}
