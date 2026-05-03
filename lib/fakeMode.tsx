'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface FakeModeCtx {
  fakeMode: boolean
  toggleFakeMode: () => void
}

const FakeModeContext = createContext<FakeModeCtx>({
  fakeMode: false,
  toggleFakeMode: () => {},
})

export function FakeModeProvider({ children }: { children: ReactNode }) {
  const [fakeMode, setFakeMode] = useState(false)
  return (
    <FakeModeContext.Provider value={{ fakeMode, toggleFakeMode: () => setFakeMode((f) => !f) }}>
      {children}
    </FakeModeContext.Provider>
  )
}

export function useFakeMode() {
  return useContext(FakeModeContext)
}
