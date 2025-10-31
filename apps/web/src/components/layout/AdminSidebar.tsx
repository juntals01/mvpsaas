// apps/web/src/components/layout/AdminSidebar.tsx
'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
};

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  const content = (
    <aside className='flex h-full w-64 flex-col border-r bg-white'>
      <div className='flex items-center justify-between px-4 py-3 md:hidden'>
        <span className='text-sm font-semibold'>Navigation</span>
        <button
          aria-label='Close sidebar'
          onClick={onClose}
          className='rounded-lg border p-1.5'
        >
          <X className='h-4 w-4' />
        </button>
      </div>

      <nav className='px-2 py-3'>
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                active && 'bg-gray-100 text-gray-900'
              )}
              onClick={onClose}
            >
              <Icon className='h-4 w-4' />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className='mt-auto px-3 pb-4 text-xs text-gray-500'>v1.0.0</div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className='relative hidden md:block'>{content}</div>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/30 transition-opacity',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-64 -translate-x-full transform bg-white shadow-xl transition-transform',
            open && 'translate-x-0'
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
