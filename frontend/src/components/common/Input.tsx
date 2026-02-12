/**
 * Input Component
 *
 * Reusable input aligned with Design/README.md:
 * - White background, light gray border, rounded corners (match buttons/cards).
 * - Placeholder: light gray. Label above, optional helper/error below.
 * - Password: eye icon on the right to toggle visibility.
 */

import { useState } from 'react';
import type { InputProps } from '../../types';

const baseInputClasses =
  'block w-full rounded-card border border-gray-300 bg-white px-3 py-2.5 text-[var(--color-text)] placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-70';

/** Eye icon when password is hidden (click to show). */
function EyeOpenIcon() {
  return (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

/** Eye-off icon when password is visible (click to hide). */
function EyeOffIcon() {
  return (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export function Input({
  label,
  error,
  className = '',
  id,
  type: typeProp = 'text',
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const isPassword = typeProp === 'password';
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword && showPassword ? 'text' : typeProp;

  const inputElement = (
    <input
      id={inputId}
      type={inputType}
      className={[
        baseInputClasses,
        isPassword && 'pr-10',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${inputId}-error` : undefined}
      {...rest}
    />
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}
      {isPassword ? (
        <div className="relative">
          {inputElement}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
          </button>
        </div>
      ) : (
        inputElement
      )}
      {error && (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
