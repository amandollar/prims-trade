'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { discussionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Discussion } from '@/lib/types';

export default function DiscussionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    discussionApi.getById(id).then((res) => {
      if (res.success && res.data) setDiscussion(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    const res = await discussionApi.addComment(id, { content: comment });
    setSubmittingComment(false);
    if (res.success && res.data) {
      setDiscussion(res.data);
      setComment('');
    } else {
      setError(res.message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    const res = await discussionApi.deleteComment(id, commentId);
    if (res.success && res.data) {
      setDiscussion(res.data);
    } else {
      setError(res.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this discussion?')) return;
    setDeleting(true);
    const res = await discussionApi.delete(id);
    setDeleting(false);
    if (res.success) {
      router.push('/discussions');
    } else {
      setError(res.message);
    }
  };

  if (loading) {
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

  return (
    <>
      <Nav />
      <main className="container-app py-6">
        <Link href="/discussions" className="link-muted text-sm">
          ← Discussions
        </Link>

        <div className="card card-body mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="page-title">{discussion.title}</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Posted on {new Date(discussion.createdAt).toLocaleDateString()}
            </p>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Link href={`/discussions/${id}/edit`} className="btn-secondary">
                Edit
              </Link>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="btn-danger"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 text-zinc-700 whitespace-pre-wrap leading-relaxed">
          {discussion.content}
        </p>
      </div>

      {error && <div className="alert-error mt-4">{error}</div>}

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-zinc-700 mb-3">
          Comments ({discussion.comments.length})
        </h2>

        {discussion.comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet. Be the first to reply!</p>
        ) : (
          <div className="space-y-3">
            {discussion.comments.map((c) => (
              <div key={c._id} className="card px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-zinc-700 flex-1">{c.content}</p>
                  {(c.createdBy === user?.id || user?.role === 'admin') && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-xs text-red-600 hover:underline shrink-0"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              className="input min-h-[80px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              required
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={submittingComment || !comment.trim()}
              className="btn-primary mt-2"
            >
              {submittingComment ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            <Link href="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>{' '}
            to add a comment.
          </p>
        )}
      </div>
      </main>
    </>
  );
}
