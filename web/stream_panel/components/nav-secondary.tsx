import * as React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavItem } from "./app-sidebar"
import { icons } from "lucide-react"

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  const getIcon = (iconName: string) => {
    const Icon = icons[iconName as keyof typeof icons]
    return Icon && <Icon />
  }
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                size="sm"
                className={pathname === item.url ? "bg-accent" : ""}
              >
                <a href={item.url}>
                  {item.iconName && getIcon(item.iconName)}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
