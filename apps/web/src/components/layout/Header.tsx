'use client';

import { Button } from '@/components/ui/button';
import { NAV_LINKS, SITE } from '@/constants/site';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md'>
      <div className='container mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8'>
        {/* Left: Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={128}
            height={40}
            className='h-10 w-auto rounded-lg'
          />
        </Link>

        {/* Center: Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-gray-700 hover:text-[#6c47ff]'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth */}
        <div className='flex items-center gap-4'>
          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant='ghost' className='text-sm font-medium'>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl='/dashboard'>
              <Button className='bg-[#6c47ff] hover:bg-[#5c3ed6] text-white rounded-full text-sm font-medium px-5 h-10'>
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href='/dashboard'>
              <Button
                variant='ghost'
                className='text-sm font-medium text-gray-700 hover:text-[#6c47ff]'
              >
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
