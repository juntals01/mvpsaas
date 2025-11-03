// Server Component (no "use client")

import PricingClient from '@/app/(public)/pricing/PricingClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PricingPage() {
  return <PricingClient />;
}
