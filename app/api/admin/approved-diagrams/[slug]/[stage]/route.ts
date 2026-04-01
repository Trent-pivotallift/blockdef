import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = { slug: string; stage: string }

function isAdmin(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session) return process.env.NODE_ENV === 'development'
  const user = (session as { user?: { role?: string } }).user
  return user?.role === 'admin' || process.env.NODE_ENV === 'development'
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { slug, stage } = await params
  const stageIndex = parseInt(stage, 10)

  const diagram = await prisma.approvedDiagram.findUnique({
    where: { exerciseSlug_stageIndex: { exerciseSlug: slug, stageIndex } },
  })

  if (!diagram) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(diagram)
}

export async function PUT(req: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug, stage } = await params
  const stageIndex = parseInt(stage, 10)
  const { diagramJson, title } = await req.json()

  const diagram = await prisma.approvedDiagram.upsert({
    where: { exerciseSlug_stageIndex: { exerciseSlug: slug, stageIndex } },
    update: { diagramJson, ...(title ? { title } : {}) },
    create: { exerciseSlug: slug, stageIndex, diagramJson, title: title ?? `${slug} stage ${stageIndex}` },
  })

  return NextResponse.json(diagram)
}
