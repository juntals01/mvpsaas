// apps/web/src/app/dashboard/page.tsx
import { META, SITE } from '@/constants/site';
import { STYLES } from '@/constants/styles';
import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Dashboard | ${SITE.name}`,
  description: META.description,
};

function fmtDate(v?: string | number | Date | null) {
  return v
    ? new Date(v).toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    : '—';
}

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in?redirect_url=/dashboard');
  }

  const imageUrl = user.imageUrl ?? '/avatar.png';
  const name =
    user.fullName ??
    ([user.firstName, user.lastName].filter(Boolean).join(' ') || '—');

  const email =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    '—';

  // If you store app roles in publicMetadata or a DB, map it here:
  const role =
    (user.publicMetadata?.role as string | undefined) ||
    (user.privateMetadata?.role as string | undefined) ||
    '—';

  const createdAt =
    (user.createdAt as unknown as number | string | Date) ?? null;
  const updatedAt =
    (user.updatedAt as unknown as number | string | Date) ?? null;
  const lastSignInAt =
    (user.lastSignInAt as unknown as number | string | Date) ?? null;

  return (
    <main className='min-h-screen bg-background'>
      <section
        className={`${STYLES.container} py-12 flex items-center justify-center`}
      >
        <div className='w-full max-w-md bg-card shadow-sm border rounded-2xl p-6 flex flex-col items-center text-center space-y-4'>
          <Image
            src={imageUrl}
            alt={name || 'User avatar'}
            width={96}
            height={96}
            className='rounded-full border object-cover'
          />

          <h1 className='text-xl font-semibold text-foreground'>{name}</h1>
          <p className='text-sm text-muted-foreground'>{email}</p>

          <div className='w-full border-t my-4' />

          <div className='grid w-full gap-2 text-sm text-left'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Role</span>
              <span className='font-medium text-foreground capitalize'>
                {role}
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
      </section>
    </main>
  );
}
