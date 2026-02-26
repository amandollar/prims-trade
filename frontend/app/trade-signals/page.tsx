'use client';

import { useEffect, useState } from 'react';
import { tradeSignalApi } from '@/lib/api';
import Nav from '@/components/Nav';
import type { TradeSignal } from '@/lib/types';

export default function PublicSignalsPage() {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tradeSignalApi.getPublic().then((res) => {
      if (res.success && res.data) setSignals(res.data);
      else setError(res.message);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Nav />
      <main>
        <div className="relative overflow-hidden rounded-b-2xl bg-zinc-800 mb-8">
          <img
            src="/signals-chart.png"
            alt=""
            className="h-40 w-full object-cover opacity-50 sm:h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="page-title text-white">Approved signals</h1>
            <p className="page-subtitle text-zinc-300">Public list. No login required.</p>
          </div>
        </div>
        <div className="container-app -mt-2 pb-6">
        {loading && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
            Loading…
          </div>
        )}
        {error && <div className="alert-error">{error}</div>}
        {!loading && !error && signals.length === 0 && (
          <div className="card card-body text-center text-zinc-500 text-sm">
            No approved signals yet.
          </div>
        )}
        {!loading && !error && signals.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signals.map((s) => (
              <li key={s.id} className="card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-40 w-full object-cover border-b border-zinc-200"
                  />
                ) : (
                  <div className="h-40 w-full border-b border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                    <img
                      src="/signals-chart.png"
                      alt=""
                      className="h-full w-full object-cover opacity-40"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-zinc-900">{s.asset}</span>
                    <span className="badge-approved">Approved</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Entry <strong className="text-zinc-700">{s.entryPrice}</strong> · SL {s.stopLoss} · TP {s.takeProfit}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{s.timeframe}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{s.rationale}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </main>
    </>
  );
}
