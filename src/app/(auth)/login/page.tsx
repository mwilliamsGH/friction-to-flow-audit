'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NeoCard } from '@/components/ui/neo-card';
import { NeoInput } from '@/components/ui/neo-input';
import { NeoButton } from '@/components/ui/neo-button';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeoCard padding="xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>



      <form onSubmit={handleSubmit} className="space-y-5">
        <NeoInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <NeoInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="neo-inset p-3 text-accent-red text-sm text-center">
            {error}
          </div>
        )}

        <NeoButton
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={loading}
        >
          Sign In
        </NeoButton>
      </form>

      <div className="mt-6 text-center space-y-3">
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Forgot your password?
        </Link>

        <div className="text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-primary hover:text-primary-hover transition-colors font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </NeoCard>
  );
}
