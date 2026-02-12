/**
 * Register Form Component
 *
 * Name (optional), email + password form; calls auth store register. Matches Design/README.md.
 */

import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuthStore } from '../../store/authStore';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading, error, clearError } = useAuthStore();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    try {
      await register(email, password, name.trim() || undefined);
    } catch {
      // Error is set in store and displayed below
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <Input
        label="Full name (optional)"
        type="text"
        placeholder="Jane Doe"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        disabled={loading}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="jane@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
        disabled={loading}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>
      <p className="text-center text-sm text-[var(--color-text)]">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
