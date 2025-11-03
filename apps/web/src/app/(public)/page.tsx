import { STYLES } from '@/constants/styles';
import { PricingTable } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-white to-slate-50 text-foreground'>
      {/* Hero */}
      <section className={`${STYLES.container} pt-16 pb-20 lg:pt-24 lg:pb-28`}>
        <div className='grid items-center gap-10 lg:gap-16 md:grid-cols-2'>
          {/* Left: Copy */}
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur'>
              <span className='i-lucide-rocket inline-block h-3.5 w-3.5' />
              <span>Start shipping in hours, not months</span>
            </div>

            <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
              Launch your SaaS{' '}
              <span className='bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'>
                10× faster
              </span>
            </h1>

            <p className='max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg'>
              Skip boilerplate and infrastructure headaches. MVP Base gives you
              a production‑ready stack so you can ship features, validate
              customers, and grow—today.
            </p>

            <ul className='grid max-w-xl grid-cols-1 gap-3 text-sm text-foreground/90 sm:text-base'>
              <li className='flex items-start gap-3'>
                <span className='i-lucide-badge-check mt-1 inline-block h-5 w-5' />
                <span>
                  Next.js + NestJS monorepo, TypeORM, Docker (Postgres, Redis,
                  MinIO)
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='i-lucide-badge-check mt-1 inline-block h-5 w-5' />
                <span>
                  Clerk auth out of the box — sessions on web, JWT verify on API
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='i-lucide-badge-check mt-1 inline-block h-5 w-5' />
                <span>
                  Built‑in pricing + subscriptions UI, seeding, and reset
                  countdown
                </span>
              </li>
            </ul>

            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <Link
                href='#pricing'
                className='inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:opacity-90'
              >
                View Pricing
              </Link>
              <Link
                href='#demo'
                className='inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted'
              >
                Try the Live Demo
              </Link>
            </div>

            <div className='flex items-center gap-4 pt-1 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <span className='i-lucide-shield-check h-4 w-4' />
                <span>Prod‑ready foundation</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='i-lucide-zap h-4 w-4' />
                <span>Turbo‑powered DX</span>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className='relative'>
            <div className='relative aspect-[16/11] overflow-hidden rounded-3xl border bg-card shadow-lg'>
              <Image
                src='/banner-right.png'
                alt='MVP Base dashboard preview'
                fill
                priority
                className='object-cover'
              />
            </div>
            <div className='pointer-events-none absolute -bottom-6 -left-6 hidden rotate-6 select-none sm:block'>
              <div className='rounded-2xl border bg-white/80 px-4 py-2 text-xs shadow backdrop-blur'>
                <span className='font-semibold'>Ship fast</span> — CLI + recipes
                get you from zero to demo in minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${STYLES.container} pb-20 lg:pb-28`}>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Loved by builders
          </h2>
          <p className='mt-3 text-muted-foreground'>
            Founders and devs use MVP Base to skip boilerplate and ship real
            product sooner.
          </p>
        </div>

        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          <figure className='rounded-2xl border bg-card p-6 shadow-sm'>
            <blockquote className='text-sm leading-relaxed text-foreground/90'>
              “We swapped weeks of setup for a single afternoon. Auth, DB,
              queues—done. We focused on features.”
            </blockquote>
            <figcaption className='mt-5 flex items-center gap-3'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
                NL
              </span>
              <div>
                <div className='text-sm font-medium'>Norberto L.</div>
                <div className='text-xs text-muted-foreground'>
                  Founder, Klicky AI
                </div>
              </div>
            </figcaption>
          </figure>

          <figure className='rounded-2xl border bg-card p-6 shadow-sm'>
            <blockquote className='text-sm leading-relaxed text-foreground/90'>
              “The monorepo pattern + Clerk integration is chef&apos;s kiss.
              Clean, modern, and easy to extend.”
            </blockquote>
            <figcaption className='mt-5 flex items-center gap-3'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
                KM
              </span>
              <div>
                <div className='text-sm font-medium'>K. Muliadie</div>
                <div className='text-xs text-muted-foreground'>
                  CTO, Legal‑Tech
                </div>
              </div>
            </figcaption>
          </figure>

          <figure className='rounded-2xl border bg-card p-6 shadow-sm'>
            <blockquote className='text-sm leading-relaxed text-foreground/90'>
              “Best DX I&apos;ve had in ages. Turbo tasks, Dockerized infra, and
              sensible defaults everywhere.”
            </blockquote>
            <figcaption className='mt-5 flex items-center gap-3'>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
                AK
              </span>
              <div>
                <div className='text-sm font-medium'>Axl J. T.</div>
                <div className='text-xs text-muted-foreground'>
                  Eng Lead, E‑commerce
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Pricing Table */}
      <section id='pricing' className={`${STYLES.container} pb-24`}>
        <div className='rounded-3xl border bg-card/90 p-4 sm:p-6 shadow-sm backdrop-blur'>
          <PricingTable
            appearance={{
              variables: { colorBackground: 'white', colorText: 'black' },
              elements: { rootBox: 'w-full' },
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
