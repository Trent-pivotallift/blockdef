import type { CanvasState, CanvasAction, ConnectionType } from '@/types/diagram'
import { v4 as uuidv4 } from 'uuid'

export function createInitialState(): CanvasState {
  return {
    nodes: [],
    connections: [],
    selectedNodeId: null,
    connectingFromId: null,
    currentTool: 'pointer',
    portDirection: 'inout',
    zoom: 1,
    panX: -12,
    panY: -28,
    frameW: 1100,
    frameH: 720,
  }
}

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.node], connectingFromId: null }

    case 'MOVE_NODE': {
      const moving = state.nodes.find(n => n.id === action.id)
      if (!moving) return state
      const dx = action.x - moving.x
      const dy = action.y - moving.y
      return {
        ...state,
        nodes: state.nodes.map(n => {
          if (n.id === action.id) return { ...n, x: action.x, y: action.y }
          // Co-move ports owned by this block
          if (n.parentId === action.id) return { ...n, x: n.x + dx, y: n.y + dy }
          return n
        }),
      }
    }

    case 'DELETE_NODE': {
      // Cascade deletion to any ports whose parentId matches the deleted node
      const childIds = new Set(
        state.nodes.filter(n => n.parentId === action.id).map(n => n.id)
      )
      const removed = new Set([action.id, ...childIds])
      return {
        ...state,
        nodes: state.nodes.filter(n => !removed.has(n.id)),
        connections: state.connections.filter(
          c => !removed.has(c.sourceId) && !removed.has(c.targetId)
        ),
        selectedNodeId: removed.has(state.selectedNodeId ?? '') ? null : state.selectedNodeId,
        connectingFromId: removed.has(state.connectingFromId ?? '') ? null : state.connectingFromId,
      }
    }

    case 'RENAME_NODE':
      return {
        ...state,
        nodes: state.nodes.map((n) => (n.id === action.id ? { ...n, name: action.name } : n)),
      }

    case 'SET_TOOL':
      return { ...state, currentTool: action.tool, connectingFromId: null, selectedNodeId: null }

    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.id, connectingFromId: null }

    case 'BEGIN_CONNECTION':
      return { ...state, connectingFromId: action.fromId, selectedNodeId: null }

    case 'COMPLETE_CONNECTION': {
      if (!state.connectingFromId || state.connectingFromId === action.toId) {
        return { ...state, connectingFromId: null }
      }
      const duplicate = state.connections.some(
        (c) => c.sourceId === state.connectingFromId && c.targetId === action.toId
      )
      if (duplicate) return { ...state, connectingFromId: null }

      const newConn = {
        id: uuidv4(),
        sourceId: state.connectingFromId!,
        targetId: action.toId,
        type: action.connectionType,
      }
      return {
        ...state,
        connections: [...state.connections, newConn],
        connectingFromId: null,
      }
    }

    case 'ADD_CONNECTION': {
      const duplicate = state.connections.some(
        (c) => c.sourceId === action.sourceId && c.targetId === action.targetId
      )
      if (duplicate) return state
      return {
        ...state,
        connections: [
          ...state.connections,
          { id: uuidv4(), sourceId: action.sourceId, targetId: action.targetId, type: action.connectionType },
        ],
      }
    }

    case 'DELETE_CONNECTION':
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.id),
      }

    case 'SET_PORT_DIRECTION':
      return { ...state, portDirection: action.direction }

    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.25, Math.min(2, action.zoom)) }

    case 'SET_PAN':
      return { ...state, panX: action.x, panY: action.y }

    case 'RESIZE_FRAME':
      return { ...state, frameW: Math.max(200, action.w), frameH: Math.max(150, action.h) }

    case 'CLEAR_CANVAS':
      return { ...createInitialState(), currentTool: state.currentTool }

    case 'LOAD_DIAGRAM':
      return { ...createInitialState(), nodes: action.nodes, connections: action.connections }

    default:
      return state
  }
}
