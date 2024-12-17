import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tv2, Newspaper, Bell, Settings, Tags } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile App Management",
  description: "Manage your mobile app content and settings",
};

export default function AppPage() {
  const features = [
    {
      title: "TV Shows",
      description: "Manage your TV shows and episodes",
      icon: Tv2,
      href: "/dashboard/app/tv-shows",
    },
    {
      title: "Articles",
      description: "Create and manage news articles",
      icon: Newspaper,
      href: "/dashboard/app/articles",
    },
    {
      title: "Featured Sections",
      description: "Create and manage featured sections",
      icon: Tags,
      href: "/dashboard/app/featured-section",
    },
    {
      title: "Push Notifications",
      description: "Send notifications to your mobile users",
      icon: Bell,
      href: "/dashboard/app/push-notifications",
    },
    {
      title: "App Settings",
      description: "Configure your mobile app settings",
      icon: Settings,
      href: "/dashboard/app/settings",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mobile App</h1>
            <p className="text-muted-foreground">
              Manage your mobile app content and settings
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="h-8 w-8" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Link href={feature.href}>
                  <Button className="w-full">
                    Manage {feature.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}