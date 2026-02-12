/**
 * Login Form Component
 *
 * Email + password form; calls auth store login. Matches Design/README.md (primary button, link style).
 */

import { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuthStore } from '../../store/authStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, error, clearError } = useAuthStore();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    try {
      await login(email, password);
    } catch {
      // Error is set in store and displayed below
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        placeholder="Email address"
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
        autoComplete="current-password"
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
        {loading ? 'Signing in…' : 'Log In'}
      </Button>
      <p className="text-center text-sm text-[var(--color-text)]">
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}
