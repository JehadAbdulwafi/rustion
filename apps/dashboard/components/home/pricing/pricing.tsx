"use client";
import { Toggle } from '@/components/shared/toggle/toggle';
import { PriceCards } from '@/components/home/pricing/price-cards';
import { useState } from 'react';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { usePaddlePrices } from '@/hooks/use-poddle-prices';

interface Props {
  country: string;
}

export function Pricing({ country }: Props) {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);
  const { prices, loading } = usePaddlePrices(undefined, country);

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      <Toggle frequency={frequency} setFrequency={setFrequency} />
      <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
    </div>
  );
}
