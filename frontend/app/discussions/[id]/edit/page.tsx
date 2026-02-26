'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { discussionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Discussion } from '@/lib/types';

export default function EditDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const id = params.id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    discussionApi.getById(id).then((res) => {
      if (res.success && res.data) {
        setDiscussion(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      } else {
        setError(res.message);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading || authLoading) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
            Loading…
          </div>
        </main>
      </>
    );
  }

  if (error && !discussion) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="alert-error">{error}</div>
        </main>
      </>
    );
  }

  if (!discussion) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="alert-error">Discussion not found</div>
        </main>
      </>
    );
  }

  const canEdit = discussion.createdBy === user?.id || user?.role === 'admin';
  if (!canEdit) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="alert-error">You don't have permission to edit this discussion.</div>
        </main>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await discussionApi.update(id, { title, content });
    setSubmitting(false);
    if (res.success) {
      router.push(`/discussions/${id}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      <Nav />
      <main className="container-app py-6">
        <Link href={`/discussions/${id}`} className="link-muted text-sm">
          ← Discussion
        </Link>
        <div className="section-head mt-4">
          <h1 className="page-title">Edit Discussion</h1>
          <p className="page-subtitle">Update your discussion.</p>
        </div>

        <form onSubmit={handleSubmit} className="card card-body mt-6 space-y-4">
          {error && <div className="alert-error">{error}</div>}

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              className="input min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              maxLength={5000}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : 'Save'}
            </button>
            <Link href={`/discussions/${id}`} className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
