'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { CanvasState, CanvasAction, ToolType } from '@/types/diagram'
import { canvasReducer, createInitialState } from './reducer'

interface CanvasContextValue {
  state: CanvasState
  dispatch: React.Dispatch<CanvasAction>
}

const CanvasContext = createContext<CanvasContextValue | null>(null)

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, undefined, createInitialState)
  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas(): CanvasContextValue {
  const ctx = useContext(CanvasContext)
  if (!ctx) throw new Error('useCanvas must be used within CanvasProvider')
  return ctx
}
