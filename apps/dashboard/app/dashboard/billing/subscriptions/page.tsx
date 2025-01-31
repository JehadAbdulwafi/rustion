import { catchErrorTyped } from "@/api/ApiError";
import { getSubscriptions } from "@/api/subscriptionsApi";
import SubscriptionsScene from "./components/subscriptions-scene";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function page() {
  const [err, subscription] = await catchErrorTyped(getSubscriptions());
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-sm text-muted-foreground">
              Manage your subscription plan and billing
            </p>
          </div>
        </div>
      </div>
      <SubscriptionsScene subscriptions={err !== undefined ? null : subscription} />
    </div>
  );
}
