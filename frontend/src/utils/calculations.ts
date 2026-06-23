import { subDays } from 'date-fns';
import type { HabitCompletion, HabitSkip } from '../types';
import { formatDate } from './dateUtils';

/**
 * Current streak: consecutive completion days counting back from today.
 * Stops at the first skip or day without a completion.
 */
export function calculateStreak(
  completions: HabitCompletion[],
  skips: HabitSkip[],
): number {
  if (completions.length === 0) {
    return 0;
  }

  const completionDates = new Set(completions.map((completion) => formatDate(completion.date)));
  const skipDates = new Set(skips.map((skip) => formatDate(skip.date)));

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateKey = formatDate(currentDate);

    if (skipDates.has(dateKey)) {
      break;
    }

    if (completionDates.has(dateKey)) {
      streak++;
    } else {
      break;
    }

    currentDate = subDays(currentDate, 1);
  }

  return streak;
}

/**
 * Completion rate as a percentage (0–100).
 * Returns 0 when there are no completions or skips.
 */
export function calculateCompletionRate(completions: number, skips: number): number {
  const totalAttempts = completions + skips;
  if (totalAttempts === 0) {
    return 0;
  }
  return Math.round((completions / totalAttempts) * 10000) / 100;
}

/**
 * Format a duration in minutes (e.g. "1h 30m", "45m", "2h").
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
}
