// apps/web/src/app/(protected)/me/page.tsx
'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';

const fmtDate = (v?: string | null) => (v ? new Date(v).toLocaleString() : '—');

export default function Page() {
  const { user, loading, error } = useCurrentUser();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-muted-foreground'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center text-destructive'>
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center text-muted-foreground'>
        Not signed in
      </div>
    );
  }

  const { email, name, imageUrl, role, lastSignInAt, createdAt, updatedAt } =
    user;

  return (
    <main className='min-h-screen flex items-center justify-center bg-background p-8'>
      <div className='w-full max-w-md bg-card shadow-sm border rounded-2xl p-6 flex flex-col items-center text-center space-y-4'>
        <Image
          src={imageUrl || '/avatar.png'}
          alt={name || 'User avatar'}
          width={96}
          height={96}
          className='rounded-full border'
        />

        <h1 className='text-xl font-semibold text-foreground'>{name ?? '—'}</h1>
        <p className='text-sm text-muted-foreground'>{email ?? '—'}</p>

        <div className='w-full border-t my-4' />

        <div className='grid w-full gap-2 text-sm text-left'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Role</span>
            <span className='font-medium text-foreground capitalize'>
              {role ?? '—'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Last Sign In</span>
            <span className='font-medium text-foreground'>
              {fmtDate(lastSignInAt)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Created</span>
            <span className='font-medium text-foreground'>
              {fmtDate(createdAt)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Updated</span>
            <span className='font-medium text-foreground'>
              {fmtDate(updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
