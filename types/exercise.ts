export type DiagramType = 'pkg' | 'bdd' | 'ibd' | 'act'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type InputMode = 'graphical' | 'kerml'

export interface StageDefinition {
  index: number
  title: string
  diagramType: DiagramType
  taskPrompt: string        // Short "Build X with these elements" shown at top
  requiredElements: string[] // Bullet list of what to place
  instructions: string
  hints: string[]
  inputMode?: InputMode     // 'kerml' replaces ContainmentTree with KerMLBuilder; default 'graphical'
}

export interface ExerciseDefinition {
  slug: string
  title: string
  description: string
  domain: string
  difficulty: Difficulty
  isFree: boolean
  stages: StageDefinition[]
}

export const DIAGRAM_TYPE_LABELS: Record<DiagramType, string> = {
  pkg: 'Package Diagram',
  bdd: 'Block Definition Diagram',
  ibd: 'Internal Block Diagram',
  act: 'Activity Diagram',
}
