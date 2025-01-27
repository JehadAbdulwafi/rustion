import { AppSidebarData } from '@/ptypes'
import 'server-only'

export function canSeeMobileApp(user: User | null) {
  return user?.app_id ? true : false
}

export function getNavigationDTO(user: User, livestreams: Stream[] = []): AppSidebarData {
  return {
    navMain: [
      { title: "Dashboard", url: "/dashboard", iconName: "SquareTerminal" },
      {
        title: "Livestreams",
        url: "/dashboard/lives",
        iconName: "Cast",
        items: livestreams?.map((livestream) => ({
          title: livestream.name,
          url: `/dashboard/lives/${livestream.id}`
        })) || []
      },
      { title: "Channels", url: "/dashboard/channels", iconName: "Tv" },
      ...(canSeeMobileApp(user) ? [{
        title: "Mobile App",
        url: "/dashboard/app",
        iconName: "Smartphone",
        items: [
          { title: "Tv Shows", url: "/dashboard/app/tv-shows" },
          { title: "Articles", url: "/dashboard/app/articles" },
          { title: "Featured Sections", url: "/dashboard/app/featured-section" },
          { title: "Push Notifications", url: "/dashboard/app/push-notifications" },
          { title: "Settings", url: "/dashboard/app/settings" },
        ],
      }] : []),
      { title: "Analytics", url: "/dashboard/analytics", iconName: "ChartPie" },
      {
        title: "Billing",
        url: "/dashboard/billing/subscriptions",
        iconName: "CreditCard",
        items: [
          { title: "Subscriptions", url: "/dashboard/billing/subscriptions" },
          { title: "History", url: "/dashboard/billing/history" },
        ]
      },
      { title: "Plans", url: "/dashboard/plans", iconName: "BookOpen" },
    ],
    navSecondary: [
      { title: "Support", url: "/dashboard/support", iconName: "LifeBuoy" },
      { title: "Settings", url: "/dashboard/settings", iconName: "Settings2" },
      { title: "Send Feedback", url: "/dashboard/feedback", iconName: "Send" },
    ]
  }
}
