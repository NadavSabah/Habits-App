/**
 * Statistics Panel Component (placeholder for Phase 17)
 *
 * Will show habit stats: completions, skips, streaks, etc.
 * Full implementation in Task 17.3.
 */

import type { StatisticsPanelProps } from '../../types';

export function StatisticsPanel({ habitId }: StatisticsPanelProps) {
  return (
    <div className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-heading)]">
        Statistics
      </h3>
      <p className="text-sm text-[var(--color-text)] opacity-80">
        Statistics for habit “{habitId}” — full implementation in Phase 17.
      </p>
    </div>
  );
}
