export interface Tier {
  name: string;
  id: 'starter' | 'pro' | 'advanced';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}
export const PricingTier: Tier[] = [
  {
    name: 'Starter',
    id: 'starter',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: 'Ideal for beginners who want to explore live streaming with basic features.',
    features: [
      'Stream up to 3 hours per day',
      '5GB storage for recorded streams',
      'Stream forwarding to 2 platforms',
      'Basic analytics for viewer stats'
    ],
    featured: false,
    priceId: { month: '$45', year: '$480' },
  },
  {
    name: 'Pro',
    id: 'pro',
    icon: '/assets/icons/price-tiers/basic-icon.svg',
    description:
      'Perfect for creators looking for extended streaming hours and professional tools.',
    features: [
      'Stream up to 12 hours per day',
      'Unlimited workspaces for easy collaboration',
      'Advanced editing tools to enhance your streams',
      'Stream forwarding to 5 platforms, including YouTube and Facebook',
      'Priority support',
      'Everything included in the Starter plan',
    ],
    featured: true,
    priceId: { month: '$95', year: '$960' },
  },
  {
    name: 'Advanced',
    id: 'advanced',
    icon: '/assets/icons/price-tiers/pro-icon.svg',
    description:
      'Designed for professional streamers and businesses requiring maximum flexibility.',
    features: [
      'Unlimited streaming hours',
      'Unlimited storage for recorded streams',
      'Stream forwarding to unlimited platforms, including TikTok and more',
      'Custom branding for your streams',
      'Dedicated account manager',
      'Advanced analytics and reporting',
      'Everything included in the Pro plan',
    ],
    featured: false,
    priceId: { month: '$225', year: '$2400' },
  },
];
