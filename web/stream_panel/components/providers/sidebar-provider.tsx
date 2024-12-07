"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarState } from "@/hooks/use-sidebar-state"

export function PersistentSidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, setIsOpen, isReady } = useSidebarState()

  if (!isReady) {
    return null // or a loading spinner
  }

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </SidebarProvider>
  )
}
