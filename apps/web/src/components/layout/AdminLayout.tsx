// apps/web/src/app/admin/AdminLayout.tsx
'use client';

import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import * as React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='min-h-dvh'>
      <AdminHeader onOpenSidebar={() => setOpen(true)} />
      <div className='mx-auto flex max-w-7xl'>
        <AdminSidebar open={open} onClose={() => setOpen(false)} />
        <main className='flex-1 p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}
