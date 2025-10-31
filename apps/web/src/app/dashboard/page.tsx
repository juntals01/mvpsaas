// apps/web/src/app/(protected)/me/page.tsx
'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Page() {
  const { user, loading, error } = useCurrentUser();

  if (loading) return <pre>Loading...</pre>;
  if (error) return <pre>{JSON.stringify({ error }, null, 2)}</pre>;
  if (!user)
    return <pre>{JSON.stringify({ error: 'Not signed in' }, null, 2)}</pre>;

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
