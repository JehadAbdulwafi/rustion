import { icons } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  iconName?: keyof typeof icons | string;
  items?: NavItem[];
  isActive?: boolean;
}

interface AppSidebarData {
  navMain: NavItem[];
  navSecondary: NavItem[];
}
