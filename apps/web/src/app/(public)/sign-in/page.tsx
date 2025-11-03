'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function SignInInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  if (!isLoaded || !signIn || !setActive) return null;

  const signInRes = signIn as NonNullable<typeof signIn>;
  const setActiveRes = setActive as NonNullable<typeof setActive>;

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const parsed = SignInSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    try {
      setLoading(true);
      const res = await signInRes.create({
        identifier: form.email,
        password: form.password,
      });

      if (res.status === 'complete') {
        await setActiveRes({ session: res.createdSessionId });
        const nextUrl = sp.get('redirect_url') ?? '/dashboard';
        router.push(nextUrl);
        return;
      }

      if (res.status === 'needs_second_factor') {
        setError(
          'Two-factor authentication required. Please complete the next step.'
        );
        return;
      }

      setError('Sign-in requires additional steps. Please try again.');
    } catch (err: unknown) {
      const e = err as {
        errors?: { longMessage?: string; message?: string }[];
      };
      const msg =
        e?.errors?.[0]?.longMessage ??
        e?.errors?.[0]?.message ??
        'Sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleOAuth() {
    await signInRes.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sign-in',
      redirectUrlComplete: '/dashboard',
    });
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-background'>
      <div className='w-full max-w-sm space-y-6 p-6 border rounded-lg shadow bg-card'>
        <h1 className='text-2xl font-semibold text-center'>Welcome back</h1>
        <p className='text-sm text-center text-muted-foreground'>
          Sign in to your account
        </p>

        {error && (
          <p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2'>
            {error}
          </p>
        )}

        <form onSubmit={handlePasswordSignIn} className='space-y-3'>
          <Input
            type='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            type='password'
            placeholder='Password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card px-2 text-muted-foreground'>
              or continue with
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full'
          onClick={handleGoogleOAuth}
        >
          <svg className='mr-2 h-4 w-4' viewBox='0 0 48 48'>
            <path
              fill='#EA4335'
              d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C36.04 2.92 30.47 0 24 0 14.64 0 6.44 5.37 2.56 13.14l7.99 6.19C12.27 13.13 17.67 9.5 24 9.5z'
            />
            <path
              fill='#34A853'
              d='M46.98 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.94c-.56 2.91-2.23 5.38-4.74 7.05l7.27 5.63C43.82 37.12 46.98 31.3 46.98 24.55z'
            />
            <path
              fill='#4A90E2'
              d='M24 48c6.48 0 11.93-2.15 15.91-5.85l-7.27-5.63c-2.02 1.37-4.61 2.18-8.64 2.18-6.33 0-11.73-3.63-14.45-8.83l-7.99 6.17C6.44 42.63 14.64 48 24 48z'
            />
            <path
              fill='#FBBC05'
              d='M9.55 30.87c-.64-1.89-1-3.91-1-5.97s.36-4.08 1-5.97l-7.99-6.19C.93 15.06 0 19.43 0 24s.93 8.94 2.56 12.26l7.99-6.19z'
            />
          </svg>
          Sign in with Google
        </Button>

        <p className='text-sm text-center text-muted-foreground'>
          Don’t have an account?{' '}
          <a href='/sign-up' className='text-primary hover:underline'>
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}

// Wrap the inner component in Suspense
export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading…
        </div>
      }
    >
      <SignInInner />
    </React.Suspense>
  );
}
