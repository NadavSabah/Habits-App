/**
 * Habit Card Component
 *
 * Displays a single habit with left color bar by category, name, category tag, frequency,
 * completion status for today (optional), and edit/delete actions. Matches Design/README.md.
 */

import type { HabitCategory, HabitCardProps } from '../../types';
import { Button } from '../common/Button';

const categoryBarColors: Record<HabitCategory, string> = {
  MORNING: 'bg-amber-400',
  EVENING: 'bg-blue-400',
  OTHER: 'bg-gray-300',
};

const categoryLabelColors: Record<HabitCategory, string> = {
  MORNING: 'bg-amber-100 text-amber-800',
  EVENING: 'bg-blue-100 text-blue-800',
  OTHER: 'bg-gray-100 text-gray-700',
};

function formatCategory(category: HabitCategory): string {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export function HabitCard({
  habit,
  onClick,
  onEdit,
  onDelete,
  completedToday = false,
}: HabitCardProps) {
  const barClass = categoryBarColors[habit.category];
  const tagClass = categoryLabelColors[habit.category];

  return (
    <article
      className="flex overflow-hidden rounded-card bg-white shadow-sm transition-shadow hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Left edge color bar by category */}
      <div className={`w-1 shrink-0 ${barClass}`} aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-[var(--color-text-heading)]">
              {habit.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tagClass}`}
              >
                {formatCategory(habit.category)}
              </span>
              <span className="text-sm text-[var(--color-text)]">
                {habit.frequency === 'DAILY' ? 'Daily' : 'Weekly'}
                {habit.frequency === 'WEEKLY' && habit.timesPerWeek != null
                  ? ` · ${habit.timesPerWeek}x`
                  : ''}
              </span>
            </div>
          </div>
          {/* Completion status for today (Design: filled primary + check vs outline) */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              completedToday
                ? 'bg-primary text-white'
                : 'border-2 border-gray-300'
            }`}
            aria-label={completedToday ? 'Completed today' : 'Not completed today'}
          >
            {completedToday ? (
              <span className="text-lg font-bold leading-none" aria-hidden>
                ✓
              </span>
            ) : null}
          </div>
        </div>
        <div
          className="flex flex-wrap gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {onEdit && (
            <Button type="button" variant="secondary" className="text-xs" onClick={() => onEdit()}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button type="button" variant="danger" className="text-xs" onClick={() => onDelete()}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
