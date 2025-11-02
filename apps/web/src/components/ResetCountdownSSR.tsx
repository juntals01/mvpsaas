// apps/web/src/components/ResetCountdownSSR.tsx
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
    <div className='relative'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Database resets every{' '}
          <span className='font-medium'>{initial.intervalMinutes} minutes</span>
        </div>
        <div className='rounded-full border bg-white px-2.5 py-1 text-[10px] text-muted-foreground'>
          Next: {nextDisplay}
        </div>
      </div>

      <div className='rounded-xl border bg-background p-4'>
        <div className='flex items-end justify-between gap-4'>
          <div
            className='text-4xl font-semibold tabular-nums'
            aria-live='polite'
          >
            {fmt(remaining)}
          </div>
          <span className='text-xs text-muted-foreground'>mm:ss</span>
        </div>

        <div
          className='mt-4 h-2 w-full rounded-full bg-muted'
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
        >
          <div
            className='h-2 rounded-full bg-primary transition-[width] duration-300'
            style={{ width: `${pct}%` }}
          />
        </div>

        <div
          className='pointer-events-none mt-3 h-2 w-full rounded-full bg-primary/10 blur-[6px]'
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
