'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tradeSignalApi } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import type { CreateTradeSignalInput } from '@/lib/types';

export default function NewSignalPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateTradeSignalInput>({
    asset: '',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    timeframe: '',
    rationale: '',
    imageUrl: undefined,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { ...form };
    if (!payload.imageUrl) delete payload.imageUrl;
    const res = await tradeSignalApi.create(payload);
    setSubmitting(false);
    if (res.success && res.data) {
      router.push(`/dashboard/signals/${res.data.id}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <div>
      <Link href="/dashboard" className="link-muted text-sm">
        ← Dashboard
      </Link>
      <div className="section-head mt-4">
        <h1 className="page-title">New signal</h1>
        <p className="page-subtitle">Submit a trade signal for review.</p>
      </div>
      <div className="card card-body mt-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="alert-error">{error}</div>}
          <div>
            <label className="label">Asset</label>
            <input
              type="text"
              required
              placeholder="e.g. BTC, ETH"
              value={form.asset}
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
                value={form.entryPrice || ''}
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
                value={form.stopLoss || ''}
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
                value={form.takeProfit || ''}
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
              placeholder="e.g. 1D, 4H"
              value={form.timeframe}
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
              value={form.rationale}
              onChange={(e) => setForm((p) => ({ ...p, rationale: e.target.value }))}
              className="input mt-1 resize-y"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating…' : 'Create'}
            </button>
            <Link href="/dashboard" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
