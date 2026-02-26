'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Nav from '@/components/Nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="container-app py-8">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
            Loading…
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Nav />
      <main className="container-app py-6">{children}</main>
    </>
  );
}
