'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { tradeSignalApi } from '@/lib/api';
import type { TradeSignal } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <span className="badge-approved">Approved</span>;
  if (status === 'rejected') return <span className="badge-rejected">Rejected</span>;
  return <span className="badge-pending">Pending</span>;
}

export default function DashboardPage() {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tradeSignalApi.getMine().then((res) => {
      if (res.success && res.data) setSignals(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, []);

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
      <div className="section-head flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">My signals</h1>
          <p className="page-subtitle">Create and manage your trade signals.</p>
        </div>
        <Link href="/dashboard/signals/new" className="btn-primary shrink-0">
          New signal
        </Link>
      </div>
      {signals.length === 0 ? (
        <div className="card card-body text-center">
          <p className="text-zinc-500 text-sm">No signals yet.</p>
          <Link href="/dashboard/signals/new" className="btn-primary mt-3 inline-flex">
            Create signal
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-200 border border-zinc-200 rounded-md bg-white overflow-hidden">
          {signals.map((s) => (
            <li key={s.id}>
              <Link
                href={`/dashboard/signals/${s.id}`}
                className="flex gap-4 p-4 hover:bg-zinc-50/80 sm:px-5"
              >
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-20 w-28 shrink-0 rounded border border-zinc-200 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-zinc-900">{s.asset}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Entry {s.entryPrice} · SL {s.stopLoss} · TP {s.takeProfit} · {s.timeframe}
                  </p>
                </div>
                <span className="self-center text-xs text-zinc-400">View</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
