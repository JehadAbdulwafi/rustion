"use client";

import * as React from "react";
import {
  Command,
  icons,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AppSidebarData } from "@/ptypes";


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  sidebarData: AppSidebarData;
}

export function AppSidebar({ user, sidebarData, ...props }: AppSidebarProps) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-primary-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Rustion Inc</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-primary-foreground">
        <NavMain items={sidebarData.navMain} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-primary-foreground">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

