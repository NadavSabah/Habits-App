/**
 * Button Component
 *
 * Reusable button aligned with Design/README.md:
 * - Primary: indigo (#4F46E5), e.g. Log In, Create Account
 * - Secondary: light gray, e.g. filter pills, Skip Today
 * - Success: green, e.g. Mark Done
 * - Danger: red, e.g. Delete, Log Out
 */

import type { ButtonProps as ButtonPropsType } from '../../types';

const variantClasses: Record<NonNullable<ButtonPropsType['variant']>, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover focus:ring-primary-light disabled:bg-primary-light disabled:opacity-70 disabled:cursor-not-allowed',
  secondary:
    'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400 disabled:opacity-70 disabled:cursor-not-allowed',
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonPropsType) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-card px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variantClass = variantClasses[variant];
  const combinedClassName = [baseClasses, variantClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
