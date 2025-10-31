// components/layout/DashboardSidebar.tsx
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  BarChart3Icon,
  FolderIcon,
  HomeIcon,
  LifeBuoyIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const primary = [
  { href: '/dashboard', label: 'Overview', icon: HomeIcon },
  { href: '/projects', label: 'Projects', icon: FolderIcon },
  { href: '/analytics', label: 'Analytics', icon: BarChart3Icon },
];

const secondary = [
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
  { href: '/changelog', label: 'Changelog', icon: SparklesIcon },
  { href: '/support', label: 'Support', icon: LifeBuoyIcon },
];

function SidebarInner() {
  const pathname = usePathname();

  const LinkItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => {
    const active =
      pathname === href ||
      (href !== '/dashboard' && pathname?.startsWith(href + '/'));
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
          active
            ? 'bg-gray-100 text-gray-900 shadow-[inset_0_1px_0_#fff]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4',
            active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700'
          )}
        />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className='h-full w-64 shrink-0 border-r bg-white'>
      <div className='px-4 pb-2 pt-4'>
        <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
          Menu
        </div>
      </div>

      <nav className='space-y-4 px-2'>
        <div className='space-y-1'>
          {primary.map((l) => (
            <LinkItem key={l.href} {...l} />
          ))}
        </div>

        <div className='border-t pt-4'>
          <div className='mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            Workspace
          </div>
          <div className='space-y-1'>
            {secondary.map((l) => (
              <LinkItem key={l.href} {...l} />
            ))}
          </div>
        </div>
      </nav>

      <div className='mt-auto hidden p-4 md:block'>
        <div className='rounded-xl border bg-gray-50 p-3 text-xs text-gray-600'>
          <div className='mb-1 font-medium text-gray-800'>Need help?</div>
          Visit <span className='font-semibold'>Support</span> or read the{' '}
          <span className='font-semibold'>Changelog</span>.
        </div>
      </div>
    </aside>
  );
}

export function DashboardSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <>
      <div className='hidden md:block'>
        <SidebarInner />
      </div>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='left' className='w-72 p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarInner />
        </SheetContent>
      </Sheet>
    </>
  );
}
