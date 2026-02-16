/**
 * Statistics Panel Component
 *
 * Shows habit statistics: total completions, skips, completion rate,
 * current/longest streak, and total time. Fetches stats on mount.
 */

import { useEffect } from 'react';
import type { StatisticsPanelProps } from '../../types';
import { useHabitStore } from '../../store/habitStore';
import { StatisticsCard } from './StatisticsCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

function formatTotalTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainder} min`;
}

export function StatisticsPanel({ habitId }: StatisticsPanelProps) {
  const statistics = useHabitStore((state) => state.statistics[habitId]);
  const loading = useHabitStore((state) => state.loading);
  const fetchStatistics = useHabitStore((state) => state.fetchStatistics);

  useEffect(() => {
    fetchStatistics(habitId);
  }, [habitId, fetchStatistics]);

  if (loading && statistics == null) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-gray-200 bg-white p-8 shadow-sm">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-[var(--color-text)]">Loading statistics…</p>
      </div>
    );
  }

  if (statistics == null) {
    return (
      <div className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-[var(--color-text)]">
          No statistics available for this habit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">
        Statistics
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatisticsCard title="Total Completions" value={statistics.totalCompletions} />
        <StatisticsCard title="Total Skips" value={statistics.totalSkips} />
        <StatisticsCard
          title="Completion Rate"
          value={`${Math.round(statistics.completionRate)}%`}
          subtitle="Based on expected vs completed"
        />
        <StatisticsCard title="Current Streak" value={statistics.currentStreak} subtitle="days" />
        <StatisticsCard title="Longest Streak" value={statistics.longestStreak} subtitle="days" />
        <StatisticsCard
          title="Total Time"
          value={formatTotalTime(statistics.totalTime)}
          subtitle="Total time spent"
        />
      </div>
    </div>
  );
}
