'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Toggle } from '@/components/shared/toggle/toggle';
import { PriceCards } from '@/components/home/pricing/price-cards';
import { useState } from 'react';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { usePaddlePrices } from '@/hooks/use-poddle-prices';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { catchErrorTyped } from "@/api/ApiError";
import { cancelActiveSubscription, renewSubscription, Resubscribe } from "@/api/subscriptionsApi";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SubscriptionsScene({
  subscriptions,
}: {
  subscriptions: Subscription[] | null;
}) {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const { prices, loading } = usePaddlePrices(undefined, 'US');
  const { toast } = useToast();
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (!subscriptions) {
    return (
      <div className="flex flex-1 flex-col gap-4 relative">
        <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
          <Toggle frequency={frequency} setFrequency={setFrequency} />
          <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
        </div>
      </div>
    );
  }

  const handleCancelSubscription = async (id: string) => {
    const [err] = await catchErrorTyped(cancelActiveSubscription(id));
    console.log(err)
    router.refresh()
    if (err === undefined) {
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled.',
      });
    } else {
      toast({
        title: 'Subscription failed',
        description: 'Your subscription failed to cancel.',
        variant: 'destructive',
      });
    }
  };

  const handleRenewSubscription = async (id: string) => {
    const [err, data] = await catchErrorTyped(renewSubscription(id));
    console.log(err)
    router.refresh()
    if (err === undefined) {
      toast({
        title: 'Subscription renewed',
        description: 'Your subscription has been renewed.',
      });
    } else {
      toast({
        title: 'Subscription failed',
        description: 'Your subscription failed to renew.',
        variant: 'destructive',
      });
    }
  };

  const handleResubscribe = async (id: string) => {
    const [err, data] = await catchErrorTyped(Resubscribe(id));
    console.log(err)
    router.refresh()
    if (err === undefined) {
      toast({
        title: 'Subscription resubscribed',
        description: 'Your subscription has been resubscribed.',
      });
    } else {
      toast({
        title: 'Subscription failed',
        description: 'Your subscription failed to resubscribe.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      {subscriptions?.map((subscription) => (
        <Card key={subscription.id}>
          <CardContent className="p-0 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {subscription.PlanName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={subscription.status === 'active' ? 'success' :
                        subscription.status === 'pending' ? 'secondary' : 'destructive'}
                      className="capitalize"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subscription.status)}
                        {subscription.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {subscription.billingCycle}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(subscription.status === 'active' || subscription.status === 'pending') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(subscription.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {subscription.status === 'expired' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewSubscription(subscription.id)}
                        >
                          Renew
                        </Button>
                      )}
                      {subscription.status === 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResubscribe(subscription.id)}
                        >
                          Resubscribe
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
