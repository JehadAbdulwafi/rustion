import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onActionClick: () => void;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionClick,
}: EmptyStateCardProps) {
  return (
    <Card className="w-full aspect-video max-h-96 pb-0 mb-0">
      <CardContent className="flex flex-1 flex-col h-full w-full gap-4 items-center justify-center">
        <Icon className="h-16 w-16" />
        <div className="text-center">
          <h4 className="text-2xl font-bold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button className="font-medium" onClick={onActionClick}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
