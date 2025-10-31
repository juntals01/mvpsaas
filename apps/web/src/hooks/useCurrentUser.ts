'use client';

import { User } from '@/interfaces/api/user.interface';
import { useEffect, useState } from 'react';
import { useApi } from './useApi';

type MeResponse = { ok: boolean; user: User };

export function useCurrentUser() {
  const { get } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const getErrorMessage = (err: unknown): string => {
      if (err && typeof err === 'object') {
        const maybeResp = (
          err as { response?: { data?: { message?: unknown } } }
        ).response;
        const msg = maybeResp?.data?.message;
        if (typeof msg === 'string') return msg;
      }
      if (err instanceof Error) return err.message;
      return 'Failed to fetch user';
    };

    const fetchUser = async () => {
      try {
        const res = await get<MeResponse>('/users/me');
        if (active && res.ok) setUser(res.user);
      } catch (err: unknown) {
        if (active) setError(getErrorMessage(err));
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
