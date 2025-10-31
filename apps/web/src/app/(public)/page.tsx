'use client';

import { PricingTable } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      <section className='mx-auto max-w-6xl px-6 pt-16 pb-8 text-center'>
        <span className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground'>
          Pricing powered by Clerk Billing
        </span>
        <h1 className='mt-4 text-3xl sm:text-4xl font-semibold'>
          Simple, transparent pricing
        </h1>
        <p className='mt-2 text-muted-foreground'>
          Configure plans in Clerk. We’ll handle checkout & subscriptions.
        </p>
      </section>

      <section className='mx-auto max-w-6xl px-6 pb-20'>
        <div className='rounded-2xl border bg-card p-4 sm:p-6 shadow-sm'>
          <PricingTable
            appearance={{
              variables: {
                colorBackground: 'white',
                colorText: 'black',
              },
            }}
          />
        </div>

        <p className='mt-6 text-center text-xs text-muted-foreground'>
          Subscriptions are managed in your profile. Change or cancel anytime.
        </p>
      </section>
    </main>
  );
}
