// apps/web/src/hooks/useCurrentUser.ts
'use client';

import { User } from '@/interfaces/api/user.interface';
import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useCurrentUser() {
  const { get } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      try {
        const res = await get<{ ok: boolean; user: User }>('/users/me');
        if (active && res.ok) setUser(res.user);
      } catch (err: any) {
        if (active)
          setError(err?.response?.data?.message || 'Failed to fetch user');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      active = false;
    };
  }, [get]);

  return { user, loading, error };
}
