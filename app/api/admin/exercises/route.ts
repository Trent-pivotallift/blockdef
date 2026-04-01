import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug, title, description, domain, difficulty, stageCount, isFree } = await req.json()
  if (!slug || !title) return NextResponse.json({ error: 'slug and title required' }, { status: 400 })

  const exercise = await prisma.exercise.create({
    data: { slug, title, description: description ?? '', domain: domain ?? '', difficulty: difficulty ?? 'beginner', stageCount: stageCount ?? 4, isFree: isFree ?? false, isPublished: false },
  })
  return NextResponse.json(exercise, { status: 201 })
}
