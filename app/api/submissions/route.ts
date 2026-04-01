import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { gradeSubmission } from '@/lib/grading/engine'
import { getRubric } from '@/lib/grading/rubrics'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { exerciseSlug, stageIndex, diagramState, uiActionsText } = body

    if (!exerciseSlug || stageIndex === undefined || !diagramState) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const rubric = getRubric(exerciseSlug, stageIndex)
    if (!rubric) {
      return NextResponse.json({ error: 'Rubric not found' }, { status: 404 })
    }

    // Server-side grade (source of truth)
    const input = {
      nodes: diagramState.nodes ?? [],
      connections: diagramState.connections ?? [],
      uiActionsText: uiActionsText ?? '',
    }
    const result = gradeSubmission(input, rubric)

    // Persist if user is authenticated
    const session = await getServerSession(authOptions)
    if (session?.user) {
      const userId = (session.user as { id: string }).id
      const exercise = await prisma.exercise.findUnique({ where: { slug: exerciseSlug } })

      if (exercise) {
        const attempt = await prisma.userAttempt.upsert({
          where: { userId_exerciseId: { userId, exerciseId: exercise.id } },
          update: {
            currentStage: result.passed ? Math.max(stageIndex + 1, 0) : stageIndex,
            totalScore: { increment: result.passed ? result.score : 0 },
            completedAt: result.passed && stageIndex === exercise.stageCount - 1 ? new Date() : undefined,
          },
          create: {
            userId,
            exerciseId: exercise.id,
            currentStage: result.passed ? stageIndex + 1 : stageIndex,
            totalScore: result.passed ? result.score : 0,
            maxScore: exercise.stageCount * 10,
          },
        })

        await prisma.diagramSubmission.create({
          data: {
            attemptId: attempt.id,
            stageIndex,
            score: result.score,
            maxScore: result.maxScore,
            passed: result.passed,
            diagramJson: diagramState,
            feedback: result.feedback as object[],
          },
        })
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[submissions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
