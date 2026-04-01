const personas = [
  {
    title: 'OCSMP Candidates',
    pill: 'Certification Prep',
    pillColor: 'bg-[#1B1BFF] text-white',
    description:
      "Preparing for the OMG Certified Systems Modeling Professional exam? Practice with realistic scenarios that mirror the diagram types and constraints you'll face on test day.",
    bullets: ['Package, BDD, IBD, and Activity diagrams', 'OMG standards-based grading', 'Progressive difficulty'],
  },
  {
    title: 'MBSE Engineers',
    pill: 'Skill Building',
    pillColor: 'bg-zinc-950 text-white',
    description:
      'Sharpen your SysML fluency across multiple engineering domains — aerospace, automotive, medical, and infrastructure — without needing a Cameo license.',
    bullets: ['6 cross-domain scenarios', 'Real design constraints', 'Instant rubric feedback'],
  },
  {
    title: 'SysML Trainers',
    pill: 'Curriculum Tool',
    pillColor: 'bg-[#1B1BFF] text-white',
    description:
      'Assign exercises to students and track their progress. Use our domain-diverse scenarios to build curriculum or share individual exercises as supplemental practice material.',
    bullets: ['Shareable exercise links', 'Student progress tracking', 'Novel diagram collection'],
  },
]

export default function PersonaSection() {
  return (
    <section className="px-4 py-16 md:py-24" style={{ backgroundColor: '#F5F4F0' }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">§ 2.0</span>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
            Who Is This For?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className="rounded-2xl border-2 border-zinc-300 bg-[#F5F4F0] p-8 flex flex-col gap-4 hover:border-zinc-400 transition-colors"
            >
              <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${persona.pillColor}`}>
                {persona.pill}
              </span>
              <h3 className="text-xl font-black text-zinc-950">{persona.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{persona.description}</p>
              <ul className="flex flex-col gap-2 mt-auto pt-2">
                {persona.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm text-zinc-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1B1BFF] flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
