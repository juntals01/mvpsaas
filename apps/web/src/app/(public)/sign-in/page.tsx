'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@clerk/nextjs';
import { Check, Clock, Copy, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { z } from 'zod';

/* ----------------------------- schema ----------------------------- */
const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/* -------------------------- util helpers -------------------------- */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type='button'
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className='inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted'
    >
      {copied ? (
        <Check className='h-3.5 w-3.5' />
      ) : (
        <Copy className='h-3.5 w-3.5' />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

/* -------------------------- countdown -------------------------- */
type ResetProps = {
  initial: { intervalMinutes: number; now: number };
  onTick?: (target: Date) => void;
};
function nextInterval(fromMs: number, minutes: number) {
  const from = new Date(fromMs);
  from.setSeconds(0, 0);
  const mod = from.getMinutes() % minutes;
  const add = mod === 0 ? 0 : minutes - mod;
  const candidate = new Date(from);
  candidate.setMinutes(candidate.getMinutes() + add);
  if (candidate.getTime() <= fromMs)
    candidate.setMinutes(candidate.getMinutes() + minutes);
  return candidate;
}
function ResetCountdown({ initial, onTick }: ResetProps) {
  const periodMs = initial.intervalMinutes * 60_000;
  const [target, setTarget] = React.useState(() =>
    nextInterval(initial.now, initial.intervalMinutes)
  );
  const [now, setNow] = React.useState(initial.now);

  React.useEffect(() => {
    onTick?.(target);
  }, [target, onTick]);

  React.useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= target.getTime()) {
        const n = new Date(target);
        const diff = t - target.getTime();
        const steps = Math.floor(diff / periodMs) + 1;
        n.setTime(n.getTime() + steps * periodMs);
        setTarget(n);
      }
    }, 250);
    return () => clearInterval(id);
  }, [periodMs, target]);

  const remaining = Math.max(0, target.getTime() - now);
  const pct = Math.min(100, Math.max(0, 100 - (remaining / periodMs) * 100));
  const fmt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };
  const nextDisplay = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  }).format(target);

  return (
    <div className='rounded-2xl border bg-gradient-to-b from-white to-muted/40 p-5'>
      <div className='mb-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Clock className='h-4 w-4' />
          <span>
            Resets every{' '}
            <span className='font-semibold'>{initial.intervalMinutes}m</span>
          </span>
        </div>
        <div className='rounded-full border bg-white px-2.5 py-1 text-[10px] text-muted-foreground'>
          Next: {nextDisplay}
        </div>
      </div>
      <div className='flex items-end justify-between'>
        <div className='text-4xl font-semibold tabular-nums'>
          {fmt(remaining)}
        </div>
        <span className='text-xs text-muted-foreground'>mm:ss</span>
      </div>
      <div className='mt-4 h-2 w-full rounded-full bg-muted'>
        <div
          className='h-2 rounded-full bg-primary transition-[width] duration-300'
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------- main page -------------------------- */
function deriveDemoCreds() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || ']CMM5dQF3^wE;8Y6<!J0=VZMPfo-',
  };
}

function SignInInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [demoEmail, setDemoEmail] = React.useState('demo@mvpbase.com');
  const [demoPassword, setDemoPassword] = React.useState('demo-0000');

  if (!isLoaded || !signIn || !setActive)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );

  const signInRes = signIn as NonNullable<typeof signIn>;
  const setActiveRes = setActive as NonNullable<typeof setActive>;

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
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
        router.push(sp.get('redirect_url') ?? '/dashboard');
        return;
      }
      setError('Sign-in requires additional steps.');
    } catch (err: unknown) {
      const isApiErr = (
        e: unknown
      ): e is { errors?: { longMessage?: string; message?: string }[] } =>
        typeof e === 'object' && e !== null && 'errors' in e;
      setError(
        isApiErr(err)
          ? (err.errors?.[0]?.longMessage ??
              err.errors?.[0]?.message ??
              'Sign-in failed')
          : 'Sign-in failed'
      );
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
    <main className='min-h-screen bg-gradient-to-b from-white to-muted/30'>
      <section className='mx-auto max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:py-16 text-center'>
        <h1 className='text-3xl font-semibold md:text-4xl'>
          <span className='text-primary'>Login Page</span>
        </h1>
        <p className='mt-2 text-muted-foreground text-sm md:text-base'>
          Use the rotating demo credentials to explore, or sign in with Google
          to access your dashboard.
        </p>
      </section>
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:py-16'>
        {/* LEFT: Centered welcome + demo panel */}

        <section className='flex flex-col items-center justify-center gap-6 text-center md:items-start md:text-left'>
          <ResetCountdown
            initial={{ intervalMinutes: 15, now: Date.now() }}
            onTick={() => {
              const { email, password } = deriveDemoCreds();
              setDemoEmail(email);
              setDemoPassword(password);
            }}
          />

          <div className='w-full max-w-md rounded-2xl border bg-card p-5 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-sm font-semibold tracking-wide'>
                Demo credentials
              </h3>
              <span className='text-xs text-muted-foreground'>
                Auto-rotates every 15 minutes
              </span>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2'>
                <div>
                  <div className='text-[10px] uppercase text-muted-foreground'>
                    Email
                  </div>
                  <div className='font-medium'>{demoEmail}</div>
                </div>
                <CopyButton value={demoEmail} />
              </div>
              <div className='flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2'>
                <div>
                  <div className='text-[10px] uppercase text-muted-foreground'>
                    Password
                  </div>
                  <div className='font-medium'>{demoPassword}</div>
                </div>
                <CopyButton value={demoPassword} />
              </div>
              <Button
                variant='secondary'
                className='mt-2 w-full'
                onClick={() =>
                  setForm({ email: demoEmail, password: demoPassword })
                }
              >
                Use these credentials
              </Button>
            </div>
          </div>
        </section>

        {/* RIGHT: Sign-in form */}
        <section className='flex items-center'>
          <div className='w-full rounded-2xl border bg-card p-6 shadow-sm'>
            <form onSubmit={handlePasswordSignIn} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs font-medium text-muted-foreground'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-medium text-muted-foreground'>
                  Password
                </label>
                <Input
                  type='password'
                  placeholder='********'
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
              {error && (
                <div className='rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700'>
                  {error}
                </div>
              )}
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className='relative py-2'>
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

              <p className='pt-2 text-center text-sm text-muted-foreground'>
                Don’t have an account?{' '}
                <a href='/sign-up' className='text-primary hover:underline'>
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </div>
      }
    >
      <SignInInner />
    </React.Suspense>
  );
}
