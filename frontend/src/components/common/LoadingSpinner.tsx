/**
 * Loading Spinner Component
 *
 * Animated spinner for loading states. Optional size (sm / md / lg).
 */

import type { LoadingSpinnerProps } from '../../types';

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-primary border-t-transparent ${sizeClass}`}
      role="status"
      aria-label="Loading"
    />
  );
}
