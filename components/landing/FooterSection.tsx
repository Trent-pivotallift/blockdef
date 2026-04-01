export default function FooterSection() {
  return (
    <footer className="border-t-2 border-zinc-300 px-4 py-8" style={{ backgroundColor: '#F5F4F0' }}>
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-zinc-950 flex items-center justify-center text-white text-[10px] font-bold">
            BD
          </div>
          <span className="font-black text-zinc-950">
            Block<span className="text-[#1B1BFF]">Def</span>
          </span>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#waitlist" className="hover:text-zinc-950 transition-colors">Waitlist</a>
          <a href="/exercises" className="hover:text-zinc-950 transition-colors">Exercises</a>
          <a href="mailto:hello@blockdef.io" className="hover:text-zinc-950 transition-colors">Contact</a>
        </div>
        <div className="font-mono text-xs">© {new Date().getFullYear()} BlockDef</div>
      </div>
    </footer>
  )
}
