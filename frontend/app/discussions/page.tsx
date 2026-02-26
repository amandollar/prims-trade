'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { discussionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Discussion } from '@/lib/types';

export default function DiscussionsPage() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    discussionApi.getAll().then((res) => {
      if (res.success && res.data) setDiscussions(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
            Loading discussions…
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <div className="relative overflow-hidden rounded-b-2xl bg-zinc-800 mb-8">
          <img
            src="/discussions-chart.png"
            alt=""
            className="h-40 w-full object-cover opacity-50 sm:h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="page-title text-white">Discussions</h1>
            <p className="page-subtitle text-zinc-300">Join the conversation with other traders.</p>
          </div>
        </div>
        <div className="container-app -mt-2 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Discussions</h1>
            <p className="page-subtitle">Join the conversation with other traders.</p>
          </div>
          {user && (
            <Link href="/discussions/new" className="btn-primary">
              New Discussion
            </Link>
          )}
        </div>

        {error && <div className="alert-error mt-4">{error}</div>}

        {discussions.length === 0 && !error ? (
          <div className="card card-body mt-6 text-center text-zinc-500 overflow-hidden">
            <div className="relative -mx-6 -mt-6 mb-6 h-24 bg-gradient-to-r from-zinc-100 to-zinc-50">
              <img
                src="/discussions-chart.png"
                alt=""
                className="h-full w-full object-cover opacity-30"
              />
            </div>
            No discussions yet. Be the first to start one!
          </div>
        ) : (
          <div className="card mt-6 divide-y divide-zinc-100">
            {discussions.map((d) => (
              <Link
                key={d._id}
                href={`/discussions/${d._id}`}
                className="block px-4 py-3 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium text-zinc-900 truncate">{d.title}</h2>
                    <p className="text-sm text-zinc-500 mt-0.5 line-clamp-2">{d.content}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-zinc-400 shrink-0">
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                    <span className="mt-1">{d.comments.length} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </main>
    </>
  );
}
