import WaitlistForm from './WaitlistForm'

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="relative overflow-hidden paper-grid px-4 py-16 md:py-24" style={{ backgroundColor: '#EEEDE8' }}>
      {/* Decorative dots */}
      <div className="pointer-events-none absolute top-10 left-[5%] h-5 w-5 rounded-full bg-[#1B1BFF] opacity-60" />
      <div className="pointer-events-none absolute bottom-10 right-[5%] h-6 w-6 rounded-full bg-red-400 opacity-50" />
      <div className="pointer-events-none absolute top-1/3 right-[8%] h-3 w-3 rounded-full bg-[#1B1BFF] opacity-30" />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">§ 3.0</span>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
          Be First to Know
        </h2>
        <p className="mt-4 mb-10 text-zinc-500 text-lg">
          New exercises, trainer features, and community platform access — delivered to your inbox first.
        </p>
        <WaitlistForm />
      </div>
    </section>
  )
}
