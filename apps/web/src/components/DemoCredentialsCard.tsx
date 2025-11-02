'use client';
import * as React from 'react';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type='button'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className='rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted'
      aria-label={`Copy ${label}`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CredentialRow({
  k,
  v,
  secret = false,
}: {
  k: string;
  v: string;
  secret?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  const display = secret && !show ? '•'.repeat(Math.max(8, v.length)) : v;
  return (
    <div className='flex items-center justify-between gap-4 rounded-lg border bg-background px-3 py-2'>
      <div className='min-w-20 text-xs font-medium text-muted-foreground'>
        {k}
      </div>
      <div className='flex flex-1 items-center justify-end gap-2'>
        <code className='truncate text-sm'>{display}</code>
        {secret && (
          <button
            type='button'
            onClick={() => setShow((s) => !s)}
            className='rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted'
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
        <CopyButton value={v} label={k} />
      </div>
    </div>
  );
}

export function DemoCredentialsCard({ minutes }: { minutes: number }) {
  return (
    <div className='rounded-2xl border bg-card/90 p-5 shadow-sm backdrop-blur'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-base font-semibold'>Demo admin login</h2>
        <span className='rounded-full border bg-white px-2.5 py-1 text-[10px] text-muted-foreground'>
          Resets every {minutes} min
        </span>
      </div>
      <div className='space-y-2'>
        <CredentialRow k='Email' v='admin@example.com' />
        <CredentialRow k='Password' v=']CMM5dQF3^wE;8Y6<!J0=VZMPfo-' secret />
      </div>
      <div className='mt-3 text-xs text-muted-foreground'>
        For client dashboard access, sign in with Google.
      </div>
    </div>
  );
}
