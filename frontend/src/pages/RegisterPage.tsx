/**
 * Register Page
 *
 * Renders registration form. Redirects to dashboard if already authenticated.
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuthStore } from '../store/authStore';

export function RegisterPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface)] p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-heading)]">
          Register
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text)] opacity-80">
          Create an account to start tracking habits.
        </p>
        <div className="rounded-card bg-white p-6 shadow-sm">
          <RegisterForm />
        </div>
        <p className="mt-4 text-center text-sm text-[var(--color-text)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
