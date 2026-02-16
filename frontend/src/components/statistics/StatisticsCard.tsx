/**
 * Statistics Card Component
 *
 * Displays a single statistic with optional title, value, subtitle, and icon.
 * Used in StatisticsPanel for habit stats (completions, skips, streaks, etc.).
 */

import type { StatisticsCardProps } from '../../types';

export function StatisticsCard({ title, value, subtitle, icon }: StatisticsCardProps) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-text-heading)]">
            {value}
          </p>
          {subtitle != null && subtitle !== '' ? (
            <p className="mt-0.5 text-xs text-[var(--color-text)] opacity-80">{subtitle}</p>
          ) : null}
        </div>
        {icon != null ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[var(--color-text)]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
