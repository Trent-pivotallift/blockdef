'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type IconMode = 'emoji' | 'sysml'

interface IconModeContextValue {
  mode: IconMode
  toggle: () => void
}

const IconModeContext = createContext<IconModeContextValue>({
  mode: 'emoji',
  toggle: () => {},
})

export function IconModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<IconMode>('emoji')

  useEffect(() => {
    const stored = localStorage.getItem('blockdef_icon_mode') as IconMode | null
    if (stored === 'emoji' || stored === 'sysml') setMode(stored)
  }, [])

  function toggle() {
    setMode((prev) => {
      const next = prev === 'emoji' ? 'sysml' : 'emoji'
      localStorage.setItem('blockdef_icon_mode', next)
      return next
    })
  }

  return (
    <IconModeContext.Provider value={{ mode, toggle }}>
      {children}
    </IconModeContext.Provider>
  )
}

export function useIconMode() {
  return useContext(IconModeContext)
}
