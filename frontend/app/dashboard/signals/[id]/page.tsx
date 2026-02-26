'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { tradeSignalApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { TradeSignal } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="badge-approved">Approved</span>;
  if (status === 'rejected') return <span className="badge-rejected">Rejected</span>;
  return <span className="badge-pending">Pending</span>;
}

export default function SignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [signal, setSignal] = useState<TradeSignal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    tradeSignalApi.getById(id).then((res) => {
      if (res.success && res.data) setSignal(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this signal?')) return;
    setDeleting(true);
    const res = await tradeSignalApi.delete(id);
    setDeleting(false);
    if (res.success) router.push('/dashboard');
    else setError(res.message);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
        Loading…
      </div>
    );
  }
  if (error || !signal) return <div className="alert-error">{error || 'Not found'}</div>;

  const canEdit = signal.createdBy === user?.id || user?.role === 'admin';

  return (
    <div>
      <Link href="/dashboard" className="link-muted text-sm">
        ← Dashboard
      </Link>
      <div className="card card-body mt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="page-title">{signal.asset}</h1>
            <StatusBadge status={signal.status} />
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Link href={`/dashboard/signals/${id}/edit`} className="btn-secondary">
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
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="data-label">Entry price</dt>
            <dd className="data-value">{signal.entryPrice}</dd>
          </div>
          <div>
            <dt className="data-label">Stop loss</dt>
            <dd className="data-value">{signal.stopLoss}</dd>
          </div>
          <div>
            <dt className="data-label">Take profit</dt>
            <dd className="data-value">{signal.takeProfit}</dd>
          </div>
          <div>
            <dt className="data-label">Timeframe</dt>
            <dd className="data-value">{signal.timeframe}</dd>
          </div>
        </dl>
        {signal.imageUrl && (
          <div className="mt-6">
            <dt className="data-label">Chart / image</dt>
            <dd className="mt-2">
              <img
                src={signal.imageUrl}
                alt="Signal chart"
                className="max-h-72 rounded border border-zinc-200 object-contain"
              />
            </dd>
          </div>
        )}
        <div className="mt-6">
          <dt className="data-label">Rationale</dt>
          <dd className="mt-2 text-sm text-zinc-700 leading-relaxed">{signal.rationale}</dd>
        </div>
      </div>
    </div>
  );
}
