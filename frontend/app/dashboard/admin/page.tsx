'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { tradeSignalApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { TradeSignal } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="badge-approved">Approved</span>;
  if (status === 'rejected') return <span className="badge-rejected">Rejected</span>;
  return <span className="badge-pending">Pending</span>;
}

export default function AdminSignalsPage() {
  const { user } = useAuth();
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    tradeSignalApi.getAllAdmin().then((res) => {
      if (res.success && res.data) setSignals(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, [user?.role]);

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id);
    const res = await tradeSignalApi.updateStatus(id, status);
    setUpdating(null);
    if (res.success && res.data) {
      setSignals((prev) => prev.map((s) => (s.id === id ? res.data! : s)));
    }
  };

  if (user?.role !== 'admin') return <div className="alert-error">Access denied.</div>;
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
        Loading…
      </div>
    );
  }
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div>
      <div className="section-head">
        <h1 className="page-title">Admin — All signals</h1>
        <p className="page-subtitle">Approve or reject pending signals.</p>
      </div>
      <ul className="divide-y divide-zinc-200 border border-zinc-200 rounded-md bg-white overflow-hidden">
        {signals.map((s) => (
          <li key={s.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex gap-4">
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt=""
                  className="h-16 w-20 shrink-0 rounded border border-zinc-200 object-cover"
                />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-900">{s.asset}</span>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Entry {s.entryPrice} · SL {s.stopLoss} · TP {s.takeProfit} · {s.timeframe}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/dashboard/signals/${s.id}`} className="btn-ghost">
                View
              </Link>
              {s.status === 'pending' && (
                <>
                  <button
                    type="button"
                    disabled={updating === s.id}
                    onClick={() => setStatus(s.id, 'approved')}
                    className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={updating === s.id}
                    onClick={() => setStatus(s.id, 'rejected')}
                    className="btn-danger py-1.5 text-xs"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
