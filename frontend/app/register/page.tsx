'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Nav from '@/components/Nav';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await register(email, password, name || undefined);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? 'Registration failed');
  };

  return (
    <>
      <Nav />
      <main className="container-app flex min-h-[calc(100vh-3rem)] items-center justify-center py-10">
        <div className="w-full max-w-sm">
          <div className="card card-body">
            <h1 className="page-title">Create account</h1>
            <p className="page-subtitle">
              Have an account? <Link href="/login" className="link">Log in</Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error && <div className="alert-error">{error}</div>}
              <div>
                <label htmlFor="name" className="label">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input mt-1"
                />
                <p className="label-hint">Min 8 characters</p>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
