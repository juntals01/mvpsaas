// apps/web/src/app/pricing/page.tsx
import { DemoCredentialsCard } from '@/components/DemoCredentialsCard';
import { ResetCountdown } from '@/components/ResetCountdownSSR';
import { PricingTable } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Status = { nextResetAt?: string | null; intervalMinutes?: number };

async function getResetStatus(apiBase: string): Promise<Status> {
  const fallback: Status = { nextResetAt: null, intervalMinutes: 15 };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${apiBase}/system/reset/status`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!res.ok) return fallback;
    const data = (await res.json()) as Status;

    return {
      nextResetAt: data?.nextResetAt ?? null,
      intervalMinutes:
        typeof data?.intervalMinutes === 'number' &&
        isFinite(data.intervalMinutes)
          ? data.intervalMinutes
          : 15,
    };
  } catch {
    return fallback;
  }
}

export default async function Page() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const status = await getResetStatus(apiBase);
  const snapshotNow = Date.now();
  const mins = status.intervalMinutes ?? 15;

  return (
    <main className='min-h-screen bg-gradient-to-b from-white to-slate-50 text-foreground'>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(35rem_35rem_at_50%_-10%,rgba(43,127,255,0.12),transparent)]' />
        <div className='mx-auto max-w-6xl px-6 pt-16 pb-8 text-center'>
          <span className='inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur'>
            Pricing powered by Clerk Billing
          </span>
          <h1 className='mt-5 text-4xl font-semibold tracking-tight sm:text-5xl'>
            Simple, transparent pricing
          </h1>
          <p className='mx-auto mt-3 max-w-2xl text-balance text-muted-foreground'>
            Configure plans in Clerk. We’ll handle checkout, trials, and
            subscriptions.
          </p>
        </div>
      </section>

      {/* Demo credentials + countdown */}
      <section className='mx-auto max-w-6xl px-6 pb-10'>
        <div className='grid gap-6 sm:grid-cols-2'>
          {/* Credentials Card */}
          <DemoCredentialsCard minutes={mins} />

          {/* Countdown Card */}
          <div className='rounded-2xl border bg-card/90 p-5 shadow-sm backdrop-blur'>
            <ResetCountdown
              initial={{
                nextResetAt: status.nextResetAt ?? null,
                intervalMinutes: mins,
                now: snapshotNow,
              }}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className='mx-auto max-w-6xl px-6 pb-24'>
        <div className='rounded-3xl border bg-card/90 p-4 sm:p-6 shadow-sm backdrop-blur'>
          <PricingTable
            appearance={{
              variables: { colorBackground: 'white', colorText: 'black' },
              elements: {
                rootBox: 'w-full',
              },
            }}
          />
        </div>
        <p className='mt-6 text-center text-xs text-muted-foreground'>
          Manage your subscription in your profile. Change or cancel anytime.
        </p>
      </section>
    </main>
  );
}
