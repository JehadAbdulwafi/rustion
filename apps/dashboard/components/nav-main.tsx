"use client"

import { ChevronRight, icons, Loader } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavItem } from "@/ptypes"

export function NavMain({
  items,
  isLoading
}: {
  items: NavItem[]
  isLoading: boolean
}) {
  const pathname = usePathname()

  const isItemActive = (item: NavItem): boolean => {
    if (pathname === item.url) return true
    if (item.items?.some(subItem => pathname === subItem.url)) return true
    return false
  }

  const getIcon = (iconName: string) => {
    const Icon = icons[iconName as keyof typeof icons]
    return Icon && <Icon />
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item)
          return (
            <Collapsible key={item.title} asChild defaultOpen={active}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={active ? "bg-accent" : ""}
                >
                  <a href={item.url}>
                    {item.iconName && getIcon(item.iconName)}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {((!item.items?.length || item.items) && item.title === "Livestreams" && isLoading) && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                    </CollapsibleContent>
                  </>
                )}
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={pathname === subItem.url ? "bg-accent" : ""}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
