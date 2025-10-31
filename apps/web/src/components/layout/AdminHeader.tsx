// apps/web/src/components/layout/AdminHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { BellIcon, MenuIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <button
            aria-label='Open sidebar'
            className='inline-flex items-center justify-center rounded-xl border px-2.5 py-2 md:hidden'
            onClick={onOpenSidebar}
          >
            <MenuIcon className='h-5 w-5' />
          </button>

          <Link href='/admin' className='flex items-center gap-2'>
            <Image
              src='/globe.svg'
              alt='MVP Base'
              width={28}
              height={28}
              className='rounded-lg'
              priority
            />
            <span className='text-lg font-semibold tracking-tight text-gray-800'>
              Admin
            </span>
          </Link>

          <nav className='ml-4 hidden gap-1 md:flex'>
            <Link
              href='/admin'
              data-active={isActive('/admin')}
              className='rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900'
            >
              Overview
            </Link>
            <Link
              href='/admin/users'
              data-active={isActive('/admin/users')}
              className='rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900'
            >
              Users
            </Link>
            <Link
              href='/admin/settings'
              data-active={isActive('/admin/settings')}
              className='rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900'
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className='flex items-center gap-2 sm:gap-3'>
          <div className='hidden items-center gap-2 sm:flex'>
            <div className='relative'>
              <SearchIcon className='pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Search…'
                className='h-9 w-44 rounded-xl pl-8 sm:w-64'
              />
            </div>
            <Button variant='ghost' size='icon' className='rounded-xl'>
              <BellIcon className='h-5 w-5' />
            </Button>
          </div>

          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl='/admin'>
              <Button variant='ghost' className='text-sm font-medium'>
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
