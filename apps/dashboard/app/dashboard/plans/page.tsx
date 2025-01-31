"use client";

import { Toggle } from "@/components/shared/toggle/toggle";
import { PriceCards } from "@/components/home/pricing/price-cards";
import { usePaddlePrices } from "@/hooks/use-poddle-prices";
import { useState } from "react";
import { BillingFrequency, IBillingFrequency } from "@/constants/billing-frequency";

import '@/styles/home-page.css';

export default function page() {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const { prices, loading } = usePaddlePrices(undefined, 'US');

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-1 flex-col gap-4 relative">
        <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
          <Toggle frequency={frequency} setFrequency={setFrequency} />
          <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
        </div>
      </div>
    </div>
  );
}

