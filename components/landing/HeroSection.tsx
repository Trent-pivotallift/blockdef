import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden paper-grid px-4 py-20 md:py-28" style={{ backgroundColor: '#F5F4F0' }}>
      {/* Floating scatter dots — matching reference */}
      <div className="pointer-events-none absolute top-24 left-[6%]  h-5  w-5  rounded-full bg-[#1B1BFF]" />
      <div className="pointer-events-none absolute top-36 left-[9%]  h-2.5 w-2.5 rounded-full bg-[#1B1BFF] opacity-40" />
      <div className="pointer-events-none absolute top-20 right-[7%] h-3.5 w-3.5 rounded-full bg-red-500" />
      <div className="pointer-events-none absolute top-52 right-[4%] h-5  w-5  rounded-full bg-[#1B1BFF] opacity-80" />
      <div className="pointer-events-none absolute bottom-28 left-[4%]  h-6  w-6  rounded-full bg-red-400" />
      <div className="pointer-events-none absolute bottom-16 right-[10%] h-4  w-4  rounded-full bg-[#1B1BFF] opacity-50" />
      <div className="pointer-events-none absolute top-1/2 left-[2%]  h-2   w-2  rounded-full bg-zinc-400" />
      <div className="pointer-events-none absolute top-[30%] right-[18%] h-2 w-2 rounded-full bg-red-300" />

      <div className="relative mx-auto max-w-5xl">

        {/* ── PILL COLLAGE HEADLINE ── */}
        <div className="flex flex-col gap-4 items-start md:items-center">

          {/* Row 1 */}
          <div className="flex flex-wrap gap-3 items-center md:justify-center">
            {/* White outlined pill — "Practice SysML" */}
            <span
              className="rounded-full border-2 border-zinc-900 bg-[#F5F4F0] px-8 py-4 text-4xl sm:text-5xl md:text-6xl font-black text-zinc-950 leading-none tracking-tight"
            >
              Practice SysML.
            </span>

            {/* Blue filled circle — BDD icon */}
            <span className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#1B1BFF] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              BDD
            </span>

            {/* Gradient blob circle */}
            <span
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full flex-shrink-0"
              style={{ background: 'radial-gradient(circle at 35% 35%, #e040fb, #ff6b35)' }}
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-3 items-center md:justify-center">
            {/* Electric blue pill — "Master MBSE" */}
            <span
              className="rounded-full bg-[#1B1BFF] px-8 py-4 text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none tracking-tight"
            >
              Master MBSE.
            </span>

            {/* Score badge pill */}
            <span className="rounded-full border-2 border-zinc-900 bg-[#F5F4F0] px-6 py-4 flex items-center gap-2 flex-shrink-0">
              <span className="text-xl font-black text-zinc-950">8/10</span>
              <span className="text-green-600 font-bold text-sm">✓ Passed</span>
            </span>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-3 items-center md:justify-center">
            {/* Dashed-border pill — "IBD" */}
            <span
              className="rounded-full border-2 border-dashed border-zinc-400 bg-transparent px-6 py-3 text-2xl font-black text-zinc-700 leading-none flex-shrink-0"
            >
              IBD
            </span>

            {/* Plain large text */}
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-950 leading-none tracking-tight">
              Block<span className="text-[#1B1BFF]">Def</span>
            </span>

            {/* Green pill — "ACT" */}
            <span className="rounded-full bg-green-500 px-5 py-3 text-white font-black text-xl flex-shrink-0">
              ACT
            </span>

            {/* Dashed dot-line connector (decorative) */}
            <span className="hidden md:block h-px w-24 border-t-2 border-dashed border-zinc-400 self-center" />
            <span className="hidden md:block h-3 w-3 rounded-full border-2 border-zinc-400 self-center" />
          </div>
        </div>

        {/* Sub-headline */}
        <p className="mt-10 max-w-2xl mx-auto text-center text-lg text-zinc-500 leading-relaxed">
          Interactive SysML exercises graded against OMG standards. Build diagrams in your browser —
          instant feedback, no Cameo license required.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/exercises"
            className="rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 transition-colors text-center"
          >
            Try 2 Free Exercises
          </Link>
          <a
            href="#waitlist"
            className="rounded-full border-2 border-zinc-300 bg-[#F5F4F0] px-8 py-3.5 text-sm font-bold text-zinc-700 hover:border-zinc-500 transition-colors text-center"
          >
            Join the Waitlist
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 border-t border-zinc-300 pt-10">
          {[
            { stat: '6', label: 'Exercises' },
            { stat: '4', label: 'Diagram Types' },
            { stat: '24', label: 'Graded Stages' },
            { stat: '100%', label: 'Free to Start' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-4xl font-black text-zinc-950">{stat}</div>
              <div className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Built for</span>
          {['OCSMP Candidates', 'MBSE Engineers', 'SysML Trainers', 'Aerospace Teams'].map((label) => (
            <span key={label} className="text-sm font-semibold text-zinc-400">{label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
