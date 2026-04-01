export type NodeType = 'package' | 'block' | 'port' | 'action'
export type ConnectionType = 'association' | 'composition' | 'allocation'
export type ToolType = NodeType | ConnectionType | 'pointer' | 'eraser'
export type PortDirection = 'in' | 'out' | 'inout'

export interface DiagramNode {
  id: string
  type: NodeType
  name: string
  x: number
  y: number
  portDirection?: PortDirection  // flow port direction (port nodes only)
  parentId?: string              // port's parent block ID — port moves with block
  width?: number
  height?: number
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
  type: ConnectionType
}

export interface CanvasState {
  nodes: DiagramNode[]
  connections: Connection[]
  selectedNodeId: string | null
  connectingFromId: string | null
  currentTool: ToolType
  portDirection: PortDirection  // selected direction for next flow port placement
  zoom: number
  panX: number
  panY: number
  frameW: number
  frameH: number
}

export type CanvasAction =
  | { type: 'ADD_NODE'; node: DiagramNode }
  | { type: 'MOVE_NODE'; id: string; x: number; y: number }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'RENAME_NODE'; id: string; name: string }
  | { type: 'SET_TOOL'; tool: ToolType }
  | { type: 'SELECT_NODE'; id: string | null }
  | { type: 'BEGIN_CONNECTION'; fromId: string }
  | { type: 'COMPLETE_CONNECTION'; toId: string; connectionType: ConnectionType }
  | { type: 'ADD_CONNECTION'; sourceId: string; targetId: string; connectionType: ConnectionType }
  | { type: 'DELETE_CONNECTION'; id: string }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; x: number; y: number }
  | { type: 'RESIZE_FRAME'; w: number; h: number }
  | { type: 'SET_PORT_DIRECTION'; direction: PortDirection }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'LOAD_DIAGRAM'; nodes: DiagramNode[]; connections: Connection[] }

export const NODE_LABELS: Record<NodeType, string> = {
  package: 'Package',
  block: 'Block',
  port: 'Port',
  action: 'Action',
}

export const CONNECTION_LABELS: Record<ConnectionType, string> = {
  association: 'Association',
  composition: 'Composition (*--)',
  allocation: 'Allocation (<<allocate>>)',
}

export const NODE_COLORS: Record<NodeType, string> = {
  package: '#dbeafe',
  block: '#dcfce7',
  port: '#ffffff',
  action: '#f3e8ff',
}

export const NODE_TEXT_COLORS: Record<NodeType, string> = {
  package: '#1e40af',
  block: '#166534',
  port: '#27272a',
  action: '#6b21a8',
}

export const NODE_BORDER_COLORS: Record<NodeType, string> = {
  package: '#93c5fd',
  block: '#86efac',
  port: '#27272a',
  action: '#d8b4fe',
}
