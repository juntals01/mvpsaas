'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NAV_LINKS, SITE } from '@/constants/site';
import { STYLES } from '@/constants/styles';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { z } from 'zod';

const EmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export function Footer() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = React.useState<string>('');

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const parsed = EmailSchema.safeParse({ email });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? 'Invalid email');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      // Wire this to your API route later (e.g. POST /api/newsletter)
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });

      setStatus('success');
      setMessage('Thanks! You’re subscribed.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <footer className='border-t bg-white'>
      {/* Newsletter Bar */}
      <div className='bg-gradient-to-br from-[#f7f5ff] via-white to-[#eef2ff]'>
        <div className={`${STYLES.container} py-12`}>
          <div className='rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur-md md:p-10'>
            <div className='grid items-center gap-6 md:grid-cols-3'>
              <div className='md:col-span-2'>
                <h3 className='text-2xl font-semibold tracking-tight'>
                  Stay in the loop
                </h3>
                <p className='mt-1 text-sm text-gray-600'>
                  Product updates, tips, and resources. No spam—unsubscribe
                  anytime.
                </p>
              </div>

              <form
                onSubmit={onSubscribe}
                className='flex flex-col gap-3 md:flex-row'
              >
                <Input
                  type='email'
                  inputMode='email'
                  placeholder='you@example.com'
                  aria-label='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-10'
                  required
                />
                <Button
                  type='submit'
                  className='h-10 bg-[#6c47ff] hover:bg-[#5c3ed6]'
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
            </div>

            {message && (
              <p
                className={`mt-3 text-sm ${
                  status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={`${STYLES.container} py-12`}>
        <div className='grid gap-10 md:grid-cols-4'>
          {/* Brand */}
          <div className='md:col-span-2'>
            <Link href='/' className='flex items-center gap-2'>
              <Image
                src={SITE.logo}
                alt={SITE.name}
                width={140}
                height={44}
                className='h-11 w-auto rounded-lg'
              />
            </Link>
            <p className='mt-3 max-w-md text-sm text-gray-600'>
              {SITE.description}
            </p>

            <div className='mt-4 flex items-center gap-3'>
              <a
                href='mailto:contact@mvpbase.com'
                className='inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-gray-700 hover:text-[#6c47ff]'
              >
                <Mail className='h-4 w-4' />
                contact@mvpbase.com
              </a>
            </div>

            <div className='mt-4 flex items-center gap-3'>
              <a
                href='https://twitter.com/'
                target='_blank'
                rel='noreferrer'
                className='rounded-full border p-2 text-gray-700 hover:text-[#6c47ff]'
                aria-label='Twitter'
              >
                <Twitter className='h-4 w-4' />
              </a>
              <a
                href='https://github.com/'
                target='_blank'
                rel='noreferrer'
                className='rounded-full border p-2 text-gray-700 hover:text-[#6c47ff]'
                aria-label='GitHub'
              >
                <Github className='h-4 w-4' />
              </a>
              <a
                href='https://www.linkedin.com/'
                target='_blank'
                rel='noreferrer'
                className='rounded-full border p-2 text-gray-700 hover:text-[#6c47ff]'
                aria-label='LinkedIn'
              >
                <Linkedin className='h-4 w-4' />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-900'>
              Navigation
            </h4>
            <ul className='mt-3 space-y-2'>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-700 hover:text-[#6c47ff]'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-900'>
              Contact Us
            </h4>
            <ul className='mt-3 space-y-2 text-sm text-gray-700'>
              <li>
                Email:{' '}
                <a
                  href='mailto:contact@mvpbase.com'
                  className='hover:text-[#6c47ff]'
                >
                  contact@mvpbase.com
                </a>
              </li>
              <li>Hours: Mon–Fri, 9am–6pm</li>
              <li>Location: Remote-first</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t'>
        <div
          className={`${STYLES.container} flex flex-col items-center justify-between gap-4 py-6 md:flex-row`}
        >
          <p className='text-xs text-gray-600'>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className='flex items-center gap-4 text-xs text-gray-600'>
            <Link href='/terms' className='hover:text-[#6c47ff]'>
              Terms
            </Link>
            <span className='text-gray-300'>•</span>
            <Link href='/privacy' className='hover:text-[#6c47ff]'>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
