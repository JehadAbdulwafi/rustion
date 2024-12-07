import { AppSidebar } from "@/components/app-sidebar"
import { ModeSwitcher } from "@/components/header/mode-switcher"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { getUser } from "@/lib/dal"
import { cache } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/user-context"
import { getLiveStreams } from "@/api/LiveApi"
import { PersistentSidebarProvider } from "@/components/providers/sidebar-provider"
import { getNavigationDTO } from "@/lib/dto"
import { catchErrorTyped } from "@/api/ApiError"
import { redirect } from "next/navigation"

// Cache the getUser function to ensure consistent data
const getCachedUser = cache(async () => {
  try {
    return await getUser()
  } catch (error) {
    console.log('Failed to get user:', error)
    throw new Error("FAILED TO GET USER")
  }
})

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [uerr, user] = await catchErrorTyped(getCachedUser());

  if (uerr !== undefined) {
    return redirect("/")
  }

  const [lerr, lives] = await catchErrorTyped(getLiveStreams());

  const sidebarData = getNavigationDTO(user, lerr !== undefined ? [] : lives);

  return (
    <UserProvider initialUser={user}>
      <PersistentSidebarProvider>
        <AppSidebar user={user} sidebarData={sidebarData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
            <ModeSwitcher />
          </header>
          {children}
          <Toaster />
        </SidebarInset>
      </PersistentSidebarProvider>
    </UserProvider>
  )
}
