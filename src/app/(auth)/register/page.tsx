'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from "../../../lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmpassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', form);
      router.push('/songs');
    }  catch (err) {
       const error = err as { response?: { data?: { message?: string } } };
       setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-2">🎵 VinylScratch</h1>
      <p className="text-zinc-400 text-center mb-8">Create your account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {['username', 'email', 'password', 'confirmpassword'].map((field) => (
          <div key={field}>
            <label className="text-sm text-zinc-400 mb-1 block capitalize">
              {field === 'confirmpassword' ? 'Confirm Password' : field}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:border-violet-500 text-white"
            />
          </div>
        ))}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}