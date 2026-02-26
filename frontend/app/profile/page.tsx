'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { userApi } from '@/lib/api';
import Nav from '@/components/Nav';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
    if (user) {
      setName(user.name ?? '');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);
    const res = await userApi.updateMe({ name: name || undefined });
    setSaving(false);
    if (res.success && res.data) {
      setSuccess(true);
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(res.data));
    } else {
      setError(res.message);
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <Nav />
      <main className="container-app py-6">
        <div className="section-head">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Update your account details.</p>
        </div>
        <div className="card card-body max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">Saved.</div>}
            <div>
              <label htmlFor="name" className="label">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Email cannot be changed</p>
            </div>
            <p className="text-xs text-zinc-500">Role: {user.role}</p>
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
