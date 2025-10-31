// components/layout/DashboardLayout.tsx
'use client';

import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { ReactNode, useState } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='min-h-dvh bg-[linear-gradient(180deg,#ffffff,rgba(241,245,249,.6))] text-gray-900'>
      <DashboardHeader onOpenSidebar={() => setOpen(true)} />

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-[16rem_1fr]'>
          <DashboardSidebar open={open} onOpenChange={setOpen} />

          <main className='min-h-[65dvh]'>
            <div className='rounded-2xl border bg-white shadow-sm'>
              <div className='border-b px-4 py-3 sm:px-6'>
                <h1 className='text-base font-semibold tracking-tight text-gray-800'>
                  Dashboard
                </h1>
                <p className='mt-0.5 text-sm text-gray-500'>
                  Overview of your projects and recent activity
                </p>
              </div>
              <div className='p-4 sm:p-6'>{children}</div>
            </div>
          </main>
        </div>
      </div>

      <footer className='mt-8 border-t'>
        <div className='mx-auto max-w-7xl px-4 py-6 text-xs text-gray-500 sm:px-6 lg:px-8'>
          © {new Date().getFullYear()} MVP Base
        </div>
      </footer>
    </div>
  );
}
