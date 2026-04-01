import type { GradeInput, GradeResult, RubricDefinition, NodeRequirement, ConnectionRequirement } from '@/types/grading'
import type { NodeType, ConnectionType } from '@/types/diagram'

interface DiagramSnapshot {
  nodes: { id: string; type: string; name: string }[]
  connections: { id: string; sourceId: string; targetId: string; type: string }[]
}

/** Derive a RubricDefinition from an approved diagram snapshot.
 *  Every node becomes a required node; every connection becomes a required connection. */
export function deriveRubricFromDiagram(diagram: DiagramSnapshot): RubricDefinition {
  const requiredNodes: NodeRequirement[] = diagram.nodes.map(n => ({
    name: n.name,
    type: n.type as NodeType,
  }))

  const requiredConnections = diagram.connections
    .map(c => {
      const src = diagram.nodes.find(n => n.id === c.sourceId)
      const tgt = diagram.nodes.find(n => n.id === c.targetId)
      if (!src || !tgt) return null
      return { from: src.name, to: tgt.name, connectionType: c.type as ConnectionType }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)

  return {
    requiredNodes,
    requiredConnections,
    compositionRequired: diagram.connections.some(c => c.type === 'composition'),
  }
}

/** Normalize a string: lowercase, collapse whitespace, remove hyphens/underscores */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Token overlap fuzzy match. Returns true if ≥60% of rubric name tokens appear in the candidate. */
function fuzzyMatch(candidate: string, rubricName: string): boolean {
  const cTokens = normalize(candidate).split(' ')
  const rTokens = normalize(rubricName).split(' ')
  if (rTokens.length === 0) return false
  const matched = rTokens.filter(rt => cTokens.some(ct => ct === rt || ct.includes(rt) || rt.includes(ct)))
  return matched.length / rTokens.length >= 0.6
}

/** Find a node in the input that fuzzy-matches the given name (and optionally type). */
function findNode(input: GradeInput, req: NodeRequirement) {
  return input.nodes.find(n => n.type === req.type && fuzzyMatch(n.name, req.name))
}

/** Check if a connection exists between two fuzzy-matched nodes (optionally filtered by connectionType). */
function findConnection(input: GradeInput, req: ConnectionRequirement) {
  return input.connections.find(c => {
    if (req.connectionType && c.type !== req.connectionType) return false
    const src = input.nodes.find(n => n.id === c.sourceId)
    const tgt = input.nodes.find(n => n.id === c.targetId)
    if (!src || !tgt) return false
    return fuzzyMatch(src.name, req.from) && fuzzyMatch(tgt.name, req.to)
  })
}

export function gradeSubmission(input: GradeInput, rubric: RubricDefinition): GradeResult {
  let score = 10
  const feedback: GradeResult['feedback'] = []

  // 1. Required nodes — each miss: -2
  for (const req of rubric.requiredNodes) {
    if (!findNode(input, req)) {
      score -= 2
      feedback.push({
        message: `Missing required ${req.type}: "${req.name}"`,
        type: 'error',
      })
    }
  }

  // 2. Required connections — each miss: -2
  for (const req of rubric.requiredConnections ?? []) {
    if (!findConnection(input, req)) {
      const typeLabel = req.connectionType ? ` (${req.connectionType})` : ''
      score -= 2
      feedback.push({
        message: `Missing required connection${typeLabel}: "${req.from}" → "${req.to}"`,
        type: 'error',
      })
    }
  }

  // 3. Composition required — if none present: -3
  if (rubric.compositionRequired) {
    const hasComposition = input.connections.some(c => c.type === 'composition')
    if (!hasComposition) {
      score -= 3
      feedback.push({
        message: 'SysML violation: No composition relationship found. Use the composition (*--) connector.',
        type: 'error',
      })
    }
  }

  // 4. Forbidden nodes — each found: -4
  for (const fb of rubric.forbiddenNodes ?? []) {
    const found = input.nodes.find(n => fuzzyMatch(n.name, fb.name))
    if (found) {
      score -= 4
      feedback.push({
        message: `Constraint violation: "${found.name}" must not appear in this diagram.`,
        type: 'error',
      })
    }
  }

  // 5. UI actions check — -1 if not mentioned
  if (rubric.uiCheck && rubric.uiCheck.length > 0) {
    const text = input.uiActionsText.toLowerCase()
    const found = rubric.uiCheck.some(ui => text.includes(ui.toLowerCase()))
    if (!found) {
      score -= 1
      feedback.push({
        message: 'Describe your Cameo UI interactions in the actions text area.',
        type: 'warning',
      })
    }
  }

  score = Math.max(0, score)

  if (score >= 7 && feedback.length === 0) {
    feedback.push({ message: `Score: ${score}/10 — Diagram passes OMG SysML rubric.`, type: 'info' })
  } else if (score >= 7) {
    feedback.push({ message: `Score: ${score}/10 — Passed. Review warnings above to improve your diagram.`, type: 'info' })
  } else {
    feedback.push({ message: `Score: ${score}/10 — Minimum 7/10 required. Address the errors above and resubmit.`, type: 'error' })
  }

  return { score, maxScore: 10, passed: score >= 7, feedback }
}
