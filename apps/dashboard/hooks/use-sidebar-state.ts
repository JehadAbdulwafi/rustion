"use client"

import { useEffect, useState } from "react"

const SIDEBAR_STATE_KEY = "sidebar-state"

export function useSidebarState() {
  const [isReady, setIsReady] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  // Load initial state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY)
    if (stored !== null) {
      setIsOpen(JSON.parse(stored))
    }
    setIsReady(true)
  }, [])

  // Save state changes to localStorage
  useEffect(() => {
    if (isReady) {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isOpen))
    }
  }, [isReady, isOpen])

  return {
    isOpen,
    setIsOpen,
    // Only show content when initial state is loaded
    isReady
  }
}
