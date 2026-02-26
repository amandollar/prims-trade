'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { discussionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function NewDiscussionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
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

  if (!user) {
    return (
      <>
        <Nav />
        <main className="container-app py-6">
          <div className="card card-body text-center">
            <p className="text-zinc-600">Please log in to create a discussion.</p>
            <Link href="/login" className="btn-primary mt-4 inline-block">
              Log in
            </Link>
          </div>
        </main>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await discussionApi.create({ title, content });
    setSubmitting(false);
    if (res.success && res.data) {
      router.push(`/discussions/${res.data._id}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      <Nav />
      <main className="container-app py-6">
        <Link href="/discussions" className="link-muted text-sm">
          ← Discussions
        </Link>
        <div className="section-head mt-4">
          <h1 className="page-title">New Discussion</h1>
          <p className="page-subtitle">Start a conversation with the community.</p>
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
              placeholder="What's on your mind?"
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
              placeholder="Share your thoughts, questions, or insights…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Posting…' : 'Post Discussion'}
            </button>
            <Link href="/discussions" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
