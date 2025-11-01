'use client';
import * as React from 'react';

type Props = {
  initial: {
    nextResetAt?: string | null;
    intervalMinutes: number;
    now: number; // server Date.now() snapshot
  };
};

function nextInterval(fromMs: number, minutes: number) {
  const from = new Date(fromMs);
  from.setSeconds(0, 0);
  const mod = from.getMinutes() % minutes;
  const add = mod === 0 ? 0 : minutes - mod;
  const candidate = new Date(from);
  candidate.setMinutes(candidate.getMinutes() + add);
  if (candidate.getTime() <= fromMs) {
    candidate.setMinutes(candidate.getMinutes() + minutes);
  }
  return candidate;
}

export function ResetCountdown({ initial }: Props) {
  const periodMs = initial.intervalMinutes * 60_000;

  // Seed a target even if the API didn't give one
  const [target, setTarget] = React.useState<Date>(() =>
    initial.nextResetAt
      ? new Date(initial.nextResetAt)
      : nextInterval(initial.now, initial.intervalMinutes)
  );

  const [now, setNow] = React.useState<number>(initial.now);

  React.useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);

      // If we've reached/passed the target, roll it forward by whole periods
      if (t >= target.getTime()) {
        const n = new Date(target);
        // advance by as many whole periods as needed to be in the future
        const diff = t - target.getTime();
        const steps = Math.floor(diff / periodMs) + 1;
        n.setTime(n.getTime() + steps * periodMs);
        setTarget(n);
      }
    }, 250);
    return () => clearInterval(id);
  }, [periodMs, target]);

  // Remaining time modulo the period, always positive
  const rawRemaining = target.getTime() - now;
  const remaining = rawRemaining <= 0 ? 0 : rawRemaining;

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
    <section className='mx-auto max-w-6xl px-6 pb-8'>
      <div className='w-full max-w-sm rounded-2xl border bg-card p-4 shadow-sm'>
        <div className='mb-2 text-sm text-muted-foreground'>
          Database resets every {initial.intervalMinutes} minutes
        </div>
        <div
          className='text-3xl font-semibold tabular-nums'
          suppressHydrationWarning
        >
          {fmt(remaining)}
        </div>
        <div className='mt-3 h-2 w-full rounded-full bg-muted' aria-hidden>
          <div
            className='h-2 rounded-full bg-primary transition-[width] duration-300'
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className='mt-2 text-xs text-muted-foreground'
          suppressHydrationWarning
        >
          Next reset at {nextDisplay}
        </div>
      </div>
    </section>
  );
}
