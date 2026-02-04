'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NeoCard } from '@/components/ui/neo-card';
import { NeoInput } from '@/components/ui/neo-input';
import { NeoButton } from '@/components/ui/neo-button';


export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength (client-side UX check)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      setLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one digit');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create account
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const signupData = (await signupRes.json()) as { success?: boolean; error?: string };

      if (!signupRes.ok) {
        setError(signupData.error || 'Signup failed');
        return;
      }

      // Step 2: Automatically log in
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = (await loginRes.json()) as { success?: boolean; error?: string };

      if (!loginRes.ok) {
        setError(loginData.error || 'Account created but login failed. Please try logging in manually.');
        return;
      }

      // Success - redirect to dashboard
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
      <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>


      <form onSubmit={handleSubmit} className="space-y-5">
        <NeoInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

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
          placeholder="At least 8 characters with uppercase, lowercase, and number"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          helperText="8+ chars with uppercase, lowercase, and a number"
        />

        <NeoInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
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
          Create Account
        </NeoButton>
      </form>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary hover:text-primary-hover transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </NeoCard>
  );
}
