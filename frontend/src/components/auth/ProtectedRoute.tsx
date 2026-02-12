/**
 * Protected Route Component
 *
 * Renders children only when the user is authenticated.
 * If not authenticated, redirects to /login (used with React Router).
 */

import { Navigate } from 'react-router-dom';
import type { ProtectedRouteProps } from '../../types';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
