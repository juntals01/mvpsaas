// apps/web/src/hooks/useApi.ts
'use client';

import { api } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

export function useApi() {
  const { getToken } = useAuth();

  const get = useCallback(
    async <T>(url: string) => {
      const token = await getToken({ template: 'mvpbase' });
      if (!token) throw new Error('No Clerk token available');
      const res = await api.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    [getToken]
  );

  const post = useCallback(
    async <T>(url: string, data?: unknown) => {
      const token = await getToken({ template: 'mvpbase' });
      if (!token) throw new Error('No Clerk token available');
      const res = await api.post<T>(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    [getToken]
  );

  return { get, post };
}
