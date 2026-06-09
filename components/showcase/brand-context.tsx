"use client"

import * as React from "react"

type BrandContextValue = {
  brandId: string
  setBrandId: (id: string) => void
}

const BrandContext = React.createContext<BrandContextValue>({
  brandId: "default",
  setBrandId: () => {},
})

export function useBrand() {
  return React.useContext(BrandContext)
}

const STORAGE_KEY = "preview-brand"

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandId, setBrandIdState] = React.useState("default")

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setBrandIdState(saved)
  }, [])

  const setBrandId = React.useCallback((id: string) => {
    setBrandIdState(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  return (
    <BrandContext.Provider value={{ brandId, setBrandId }}>
      {children}
    </BrandContext.Provider>
  )
}
