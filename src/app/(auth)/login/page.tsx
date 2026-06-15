'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from "../../../lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/login', { email, password });
      router.push('/songs');
    }  catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-2">🎵 VinylScratch</h1>
      <p className="text-zinc-400 text-center mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:border-violet-500 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Password</label>
          <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:border-violet-500 text-white"
           />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Dont have an account?{' '}
          <Link href="/register" className="text-violet-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}