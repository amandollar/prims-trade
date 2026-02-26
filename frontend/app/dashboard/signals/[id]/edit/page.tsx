'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { tradeSignalApi } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import type { TradeSignal, CreateTradeSignalInput } from '@/lib/types';

export default function EditSignalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [form, setForm] = useState<Partial<CreateTradeSignalInput>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    tradeSignalApi.getById(id).then((res) => {
      if (res.success && res.data) {
        const s = res.data as TradeSignal;
        setForm({
          asset: s.asset,
          entryPrice: s.entryPrice,
          stopLoss: s.stopLoss,
          takeProfit: s.takeProfit,
          timeframe: s.timeframe,
          rationale: s.rationale,
          imageUrl: s.imageUrl,
        });
      } else setError(res.message);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { ...form };
    payload.imageUrl = form.imageUrl ?? '';
    const res = await tradeSignalApi.update(id, payload);
    setSubmitting(false);
    if (res.success) router.push(`/dashboard/signals/${id}`);
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
  if (error && !form.asset) return <div className="alert-error">{error}</div>;

  return (
    <div>
      <Link href={`/dashboard/signals/${id}`} className="link-muted text-sm">
        ← Signal
      </Link>
      <div className="section-head mt-4">
        <h1 className="page-title">Edit signal</h1>
        <p className="page-subtitle">Update your trade signal.</p>
      </div>
      <div className="card card-body mt-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="alert-error">{error}</div>}
          <div>
            <label className="label">Asset</label>
            <input
              type="text"
              required
              value={form.asset ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, asset: e.target.value.toUpperCase() }))}
              className="input mt-1"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Entry price</label>
              <input
                type="number"
                step="any"
                required
                value={form.entryPrice ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, entryPrice: Number(e.target.value) }))}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">Stop loss</label>
              <input
                type="number"
                step="any"
                required
                value={form.stopLoss ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, stopLoss: Number(e.target.value) }))}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">Take profit</label>
              <input
                type="number"
                step="any"
                required
                value={form.takeProfit ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, takeProfit: Number(e.target.value) }))}
                className="input mt-1"
              />
            </div>
          </div>
          <div>
            <label className="label">Timeframe</label>
            <input
              type="text"
              required
              value={form.timeframe ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, timeframe: e.target.value }))}
              className="input mt-1"
            />
          </div>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            disabled={submitting}
          />
          <div>
            <label className="label">Rationale</label>
            <textarea
              required
              rows={4}
              value={form.rationale ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, rationale: e.target.value }))}
              className="input mt-1 resize-y"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : 'Save'}
            </button>
            <Link href={`/dashboard/signals/${id}`} className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
