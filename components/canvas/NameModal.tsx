'use client'

import { useState, useEffect, useRef } from 'react'
import type { NodeType } from '@/types/diagram'
import { NODE_LABELS } from '@/types/diagram'

interface Props {
  nodeType: NodeType
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function NameModal({ nodeType, onConfirm, onCancel }: Props) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) onConfirm(name.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-xs rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60">
        <h3 className="text-sm font-bold text-zinc-950 mb-1">
          New «{NODE_LABELS[nodeType]}»
        </h3>
        <p className="text-xs text-zinc-400 mb-4">Enter a name for this element.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. ${nodeType === 'package' ? 'Requirements' : nodeType === 'block' ? 'Homelab Server' : nodeType === 'port' ? 'RF Out' : 'Collect Data'}`}
            className="rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-lg bg-zinc-950 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
