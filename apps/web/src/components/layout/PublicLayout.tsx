'use client';

import { Header } from '@/components/layout/Header';
import * as React from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
