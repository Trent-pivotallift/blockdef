import type { NodeType, ConnectionType } from '@/types/diagram'

export interface GradeInput {
  nodes: { id: string; type: string; name: string }[]
  connections: { type: string; sourceId: string; targetId: string }[]
  uiActionsText: string
}

export interface NodeRequirement {
  name: string       // fuzzy matched against node name
  type: NodeType     // must match exactly
}

export interface ConnectionRequirement {
  from: string            // fuzzy matched against source node name
  to: string              // fuzzy matched against target node name
  connectionType?: ConnectionType  // if set, connection type must match
}

export interface ForbiddenNode {
  name: string   // fuzzy matched — presence causes a deduction
}

export interface RubricDefinition {
  requiredNodes: NodeRequirement[]
  requiredConnections?: ConnectionRequirement[]
  forbiddenNodes?: ForbiddenNode[]
  compositionRequired?: boolean
  uiCheck?: string[]
}

export interface GradeFeedback {
  message: string
  type: 'error' | 'warning' | 'info'
}

export interface GradeResult {
  score: number
  maxScore: number
  passed: boolean
  feedback: GradeFeedback[]
}
