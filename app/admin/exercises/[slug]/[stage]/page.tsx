import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { exercises } from '@/lib/exercises/definitions'
import AdminDiagramWorkspace from '@/components/canvas/AdminDiagramWorkspace'
import type { DiagramNode, Connection } from '@/types/diagram'

interface DiagramJson {
  nodes: DiagramNode[]
  connections: Connection[]
}

type Params = { slug: string; stage: string }

export default async function AdminExerciseStagePage({ params }: { params: Promise<Params> }) {
  const { slug, stage } = await params
  const stageIndex = parseInt(stage, 10)

  const exercise = exercises.find(e => e.slug === slug)
  if (!exercise) notFound()

  const stageObj = exercise.stages[stageIndex]
  if (!stageObj) notFound()

  const approved = await prisma.approvedDiagram.findUnique({
    where: { exerciseSlug_stageIndex: { exerciseSlug: slug, stageIndex } },
  })

  const diagramJson = (approved?.diagramJson as unknown as DiagramJson) ?? { nodes: [], connections: [] }

  return (
    <div className="h-screen flex flex-col">
      <AdminDiagramWorkspace
        exerciseSlug={slug}
        stageIndex={stageIndex}
        diagramType={stageObj.diagramType}
        initialNodes={diagramJson.nodes}
        initialConnections={diagramJson.connections}
        diagramTitle={approved?.title ?? `${exercise.title} — Stage ${stageIndex}`}
      />
    </div>
  )
}
