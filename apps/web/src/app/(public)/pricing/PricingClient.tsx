'use client';

import { PricingTable } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PricingClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main
      className='min-h-screen bg-white text-gray-900'
      style={
        {
          ['--primary' as string]: '#0ea5e9', // sky-500
          ['--secondary' as string]: '#6366f1', // indigo-500
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight'>
              Simple pricing for growing products
            </h1>
            <p className='mt-3 text-sm sm:text-base text-gray-500'>
              Start free. Upgrade when you’re ready. Manage subscriptions with
              Clerk Billing.
            </p>
          </div>
          <Link
            href='/'
            className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            style={{ borderColor: 'var(--secondary)' }}
          >
            ← Back
          </Link>
        </div>
      </section>

      {/* PricingTable */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16'>
        <div className='rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm'>
          {mounted ? (
            <PricingTable
              appearance={{
                variables: {
                  colorBackground: '#ffffff',
                  colorText: '#111111',
                  colorInputText: '#111111',
                  colorBorder: '#e5e7eb',
                  colorPrimary: 'var(--primary)',
                  colorShimmer: '#f9fafb',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow',
                  buttonPrimary:
                    'rounded-xl font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                  priceTag: 'text-gray-900',
                  planName: 'text-gray-900',
                  planDescription: 'text-gray-500',
                  featureIcon: 'text-[var(--secondary)]',
                  featureText: 'text-gray-700',
                  toggle: 'text-gray-800',
                  couponInput:
                    'bg-white text-gray-900 border-gray-300 placeholder:text-gray-400',
                  couponButton:
                    'text-gray-800 border border-gray-300 hover:bg-gray-100',
                },
              }}
            />
          ) : (
            <div className='h-[520px] w-full animate-pulse rounded-2xl bg-gray-50' />
          )}
        </div>

        <p className='mt-6 text-center text-xs text-gray-500'>
          Subscriptions are handled by Clerk. You can change plans or cancel
          anytime.
        </p>
      </section>

      {/* Feature comparison */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24'>
        <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
          <table className='w-full border-collapse'>
            <thead className='bg-gray-50'>
              <tr className='text-left text-sm text-gray-600'>
                <th className='px-4 py-3 font-medium'>Feature</th>
                <th className='px-4 py-3 font-medium'>Free</th>
                <th className='px-4 py-3 font-medium'>Pro</th>
                <th className='px-4 py-3 font-medium'>Business</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 text-sm'>
              {[
                ['Users / month', '1', '5,000', '50,000+'],
                ['Projects', '1', 'Unlimited', 'Unlimited'],
                ['Team members', '—', '5', 'Unlimited'],
                ['Priority support', '—', '—', '✓'],
                ['SLA', '—', '—', '✓'],
              ].map(([f, a, b, c]) => (
                <tr key={f}>
                  <td className='px-4 py-3 text-gray-700'>{f}</td>
                  <td className='px-4 py-3'>{a}</td>
                  <td className='px-4 py-3'>{b}</td>
                  <td
                    className='px-4 py-3'
                    style={
                      c === '✓' ? { color: 'var(--secondary)' } : undefined
                    }
                  >
                    {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24'>
        <div className='grid gap-6 sm:grid-cols-2'>
          {[
            [
              'How does billing work?',
              'Plans and payments are managed by Clerk Billing. Your subscription updates instantly.',
            ],
            [
              'Can I cancel anytime?',
              'Yes. Cancel from your billing portal; access remains until the end of your period.',
            ],
            [
              'Do you offer trials?',
              'Free plan is available. Trials and coupons can be configured in Clerk Billing.',
            ],
            [
              'Do you support invoices?',
              'Yes, downloadable invoices and receipts are available in the portal.',
            ],
          ].map(([q, a]) => (
            <div
              key={q}
              className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'
              style={{ borderColor: 'var(--secondary)' }}
            >
              <h3 className='text-base font-medium text-gray-900'>{q}</h3>
              <p className='mt-2 text-sm text-gray-600'>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24'>
        <div className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Ready to get started?
          </h2>
          <p className='max-w-2xl text-sm text-gray-600'>
            Create an account, pick a plan, and you’ll be live in minutes.
          </p>
          <Link
            href='/sign-up'
            className='rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2'
            style={{
              background: 'var(--primary)',
              color: 'white',
              boxShadow:
                '0 0 0 2px color-mix(in oklab, var(--primary), transparent 70%)',
            }}
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Clerk overrides */}
      <style jsx global>{`
        .cl-component .cl-button--primary,
        .cl-component .cl-buttonPrimary {
          background: var(--primary) !important;
          color: #fff !important;
        }
        .cl-component .cl-featureIcon,
        .cl-component .cl-toggle {
          color: var(--secondary) !important;
        }
      `}</style>
    </main>
  );
}
