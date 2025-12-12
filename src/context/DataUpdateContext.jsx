import React, { createContext, useContext, useState, useCallback } from 'react'

const DataUpdateContext = createContext()

export function DataUpdateProvider({ children }) {
  const [newsUpdate, setNewsUpdate] = useState(0)
  const [matchesUpdate, setMatchesUpdate] = useState(0)

  const triggerNewsUpdate = useCallback(() => {
    setNewsUpdate(prev => prev + 1)
  }, [])

  const triggerMatchesUpdate = useCallback(() => {
    setMatchesUpdate(prev => prev + 1)
  }, [])

  return (
    <DataUpdateContext.Provider value={{ newsUpdate, matchesUpdate, triggerNewsUpdate, triggerMatchesUpdate }}>
      {children}
    </DataUpdateContext.Provider>
  )
}

export function useDataUpdate() {
  const context = useContext(DataUpdateContext)
  if (!context) {
    throw new Error('useDataUpdate must be used within DataUpdateProvider')
  }
  return context
}
