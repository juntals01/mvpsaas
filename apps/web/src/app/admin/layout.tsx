// apps/web/src/app/admin/layout.tsx

import AdminLayout from '@/components/layout/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
