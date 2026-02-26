'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Nav() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="container-app flex h-12 items-center justify-between">
          <Link href="/" className="text-base font-semibold text-zinc-900">
            Prims Trade
          </Link>
          <span className="text-xs text-zinc-400">Loading…</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="container-app flex h-12 items-center justify-between">
        <Link href="/" className="text-base font-semibold text-zinc-900">
          Prims Trade
        </Link>
        <nav className="flex items-center gap-0.5">
          <Link
            href="/trade-signals"
            className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            Signals
          </Link>
          <Link
            href="/discussions"
            className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            Discussions
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/dashboard/admin"
                  className="rounded px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                >
                  Admin
                </Link>
              )}
              <span className="mx-1 h-4 w-px bg-zinc-200" aria-hidden />
              <button
                type="button"
                onClick={logout}
                className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Log in
              </Link>
              <Link href="/register" className="btn-primary ml-1">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
