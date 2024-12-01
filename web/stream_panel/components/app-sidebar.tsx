"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Smartphone,
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
import { getLives } from "@/api/LiveApi";
import { type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
  isActive?: boolean;
}

interface AppSidebarData {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

const initialData: AppSidebarData = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: SquareTerminal, isActive: true },
    { title: "Livestreams", url: "/dashboard/lives", icon: Bot, items: [] },
    { title: "Analytics", url: "/dashboard/analytics", icon: PieChart },
    { title: "Plans", url: "/dashboard/plans", icon: BookOpen },
    {
      title: "Mobile App",
      url: "/dashboard/app",
      icon: Smartphone,
      items: [
        { title: "Tv Shows", url: "/dashboard/app/tv-shows" },
        { title: "Articles", url: "/dashboard/app/articles" },
        { title: "Featured Sections", url: "/dashboard/app/featured-section" },
        { title: "Push Notifications", url: "/dashboard/app/push-notifications" },
        { title: "Settings", url: "/dashboard/app/settings" },
      ],
    },
    { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
  ],
  navSecondary: [
    { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
    { title: "Feedback", url: "/dashboard/feedback", icon: Send },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [sidebarData, setSidebarData] = React.useState<AppSidebarData>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);

  const updateNavMainWithLives = async () => {
    setIsLoading(true);
    try {
      const _lives = await getLives();
      setSidebarData((prevState) => ({
        ...prevState,
        navMain: prevState.navMain.map((item, index) =>
          index === 1
            ? { ...item, items: _lives?.map((live) => ({ title: live.name, url: `/dashboard/lives/${live.id}` })) }
            : item
        ),
      }));
    } catch (error) {
      console.error("Failed to fetch lives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    updateNavMainWithLives();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="bg-primary-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
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
        <NavMain items={sidebarData.navMain} isLoading={isLoading} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-primary-foreground">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

