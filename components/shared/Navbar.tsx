'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-zinc-300" style={{ backgroundColor: '#F5F4F0' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-zinc-950 flex items-center justify-center text-white text-xs font-bold">
            BD
          </div>
          <span className="text-base font-bold text-zinc-950 tracking-tight">
            Block<span className="text-[#1B1BFF]">Def</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="/exercises" className="hover:text-zinc-950 transition-colors">Exercises</Link>
          <Link href="/#how-it-works" className="hover:text-zinc-950 transition-colors">How It Works</Link>
          <Link href="/#waitlist" className="hover:text-zinc-950 transition-colors">Waitlist</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/exercises"
            className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            Let&apos;s do it
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t-2 border-zinc-300 px-6 py-4 flex flex-col gap-4 text-sm" style={{ backgroundColor: '#F5F4F0' }}>
          <Link href="/exercises" className="text-zinc-600 hover:text-zinc-950 py-1" onClick={() => setMenuOpen(false)}>Exercises</Link>
          <Link href="/#how-it-works" className="text-zinc-600 hover:text-zinc-950 py-1" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/#waitlist" className="text-zinc-600 hover:text-zinc-950 py-1" onClick={() => setMenuOpen(false)}>Waitlist</Link>
          <Link
            href="/exercises"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-center font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            Let&apos;s do it
          </Link>
        </div>
      )}
    </nav>
  )
}
