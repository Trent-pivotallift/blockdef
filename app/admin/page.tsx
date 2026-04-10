import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { exercises } from '@/lib/exercises/definitions'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  type AdminUser = { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string }
  const user = session?.user as AdminUser

  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && (!session || user?.role !== 'admin')) {
    redirect('/')
  }

  const approvedDiagrams = await prisma.approvedDiagram.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const passedSubmissions = await prisma.diagramSubmission.findMany({
    where: { passed: true },
    take: 50,
    orderBy: { submittedAt: 'desc' },
    include: {
      attempt: {
        include: {
          user: { select: { name: true, email: true } },
          exercise: { select: { slug: true, title: true } },
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-zinc-950">Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage exercises and review approved diagrams</p>
        </div>

        {/* Passed Submissions */}
        <section className="mb-12">
          <h2 className="text-base font-bold text-zinc-950 mb-4">Passed Submissions</h2>
          <div className="border-2 border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 bg-zinc-50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wide">Exercise</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wide">Stage</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wide">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {passedSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-zinc-400 text-sm">No passed submissions yet.</td>
                  </tr>
                )}
                {passedSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-950">{sub.attempt.user.name ?? '—'}</div>
                      <div className="text-xs text-zinc-400">{sub.attempt.user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-950">{sub.attempt.exercise.title}</div>
                      <div className="text-xs text-zinc-400 font-mono">{sub.attempt.exercise.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-mono text-zinc-600">
                        Stage {sub.stageIndex + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#1B1BFF]">{sub.score}</span>
                      <span className="text-zinc-400">/{sub.maxScore}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Approved Diagrams */}
        <section className="mb-12">
          <h2 className="text-base font-bold text-zinc-950 mb-4">Approved Diagrams</h2>
          {approvedDiagrams.length === 0 ? (
            <div className="border-2 border-zinc-200 rounded-xl px-6 py-8 text-center text-zinc-400 text-sm">
              No approved diagrams yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedDiagrams.map((d) => {
                const stage = exercises.find(e => e.slug === d.exerciseSlug)?.stages[d.stageIndex]
                const isKerML = stage?.inputMode === 'kerml'
                return (
                <Link
                  key={d.id}
                  href={`/admin/exercises/${d.exerciseSlug}/${d.stageIndex}`}
                  className="block border-2 border-zinc-200 rounded-xl p-4 hover:border-[#1B1BFF] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-bold text-zinc-950 text-sm group-hover:text-[#1B1BFF] transition-colors">{d.title}</div>
                    {isKerML && (
                      <span className="flex-shrink-0 rounded-full bg-violet-100 border border-violet-300 px-2 py-0.5 text-[10px] font-bold text-violet-700 uppercase tracking-wide">
                        KerML
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-zinc-500">{d.exerciseSlug}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-xs text-zinc-500">Stage {d.stageIndex + 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-[#1B1BFF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit →
                    </span>
                  </div>
                </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Create Exercise */}
        <section>
          <h2 className="text-base font-bold text-zinc-950 mb-4">Create Exercise</h2>
          <div className="border-2 border-zinc-200 rounded-xl p-6">
            <form
              action="/api/admin/exercises"
              method="POST"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Slug</label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="my-exercise-slug"
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Exercise Title"
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief description of the exercise..."
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Domain</label>
                <input
                  type="text"
                  name="domain"
                  placeholder="e.g. Aerospace, Medical, Software"
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 placeholder-zinc-400 focus:border-[#1B1BFF] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Difficulty</label>
                <select
                  name="difficulty"
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 focus:border-[#1B1BFF] focus:outline-none transition-colors bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Stage Count</label>
                <input
                  type="number"
                  name="stageCount"
                  defaultValue={4}
                  min={1}
                  max={10}
                  className="rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm text-zinc-950 focus:border-[#1B1BFF] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 self-end pb-1">
                <input
                  type="checkbox"
                  name="isFree"
                  id="isFree"
                  className="h-4 w-4 rounded border-2 border-zinc-200 text-[#1B1BFF] focus:ring-[#1B1BFF]"
                />
                <label htmlFor="isFree" className="text-sm text-zinc-700 font-medium select-none">
                  Free exercise (no paywall)
                </label>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#1B1BFF] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B1BFF] focus:ring-offset-2"
                >
                  Create Exercise
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
