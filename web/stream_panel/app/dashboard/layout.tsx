import { AppSidebar } from "@/components/app-sidebar"
import { ModeSwitcher } from "@/components/header/mode-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getUser } from "@/lib/dal"
import { cache } from 'react'
import { Toaster } from "@/components/ui/toaster"

// Cache the getUser function to ensure consistent data
const getCachedUser = cache(async () => {
  try {
    return await getUser()
  } catch (error) {
    // Implement error boundary
    console.error('Error fetching user:', error)
    throw error
  }
})

export default async function DashboardLayout({
  children
}: {

  children: React.ReactNode
}) {
  const user = await getCachedUser();
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
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
    </SidebarProvider >
  )
}
