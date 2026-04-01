const steps = [
  {
    number: '01',
    title: 'Choose a Scenario',
    description:
      'Pick from aerospace, automotive, infrastructure, and medical domains. Two exercises are completely free — no account needed.',
  },
  {
    number: '02',
    title: 'Build the Diagram',
    description:
      'Drag-and-drop blocks, ports, and packages onto a canvas. Draw composition, association, and allocation relationships — just like Cameo Systems Modeler.',
  },
  {
    number: '03',
    title: 'Get Instant Feedback',
    description:
      'Submit for automated rubric grading against OMG SysML standards. Score out of 10 with specific improvement tips. Hit 7/10 to advance.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="paper-grid px-4 py-16 md:py-24" style={{ backgroundColor: '#EEEDE8' }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          {/* Technical paper: section number as annotation */}
          <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">§ 1.0</span>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-zinc-500 text-lg">
            Four diagram types. Six real-world scenarios. Instant OMG-standard grading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-zinc-300 bg-[#F5F4F0] p-8 flex flex-col gap-4"
            >
              <span className="rounded-full bg-[#1B1BFF] text-white text-xs font-bold px-3 py-1 self-start tracking-wide">
                {step.number}
              </span>
              <h3 className="text-xl font-black text-zinc-950">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Diagram type pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {['Package Diagram', 'Block Definition Diagram', 'Internal Block Diagram', 'Activity Diagram'].map((type) => (
            <span
              key={type}
              className="rounded-full border-2 border-zinc-300 bg-[#F5F4F0] px-4 py-1.5 text-xs font-semibold text-zinc-600"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
