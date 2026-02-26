'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Nav from '@/components/Nav';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? 'Login failed');
  };

  return (
    <>
      <Nav />
      <main className="container-app flex min-h-[calc(100vh-3rem)] items-center justify-center py-10">
        <div className="w-full max-w-sm">
          <div className="card card-body">
            <h1 className="page-title">Log in</h1>
            <p className="page-subtitle">
              No account? <Link href="/register" className="link">Sign up</Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error && <div className="alert-error">{error}</div>}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input mt-1"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
