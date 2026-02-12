/**
 * Habit Detail Component
 *
 * Displays a single habit: info, calendar view, and statistics panel.
 */

import type { HabitDetailProps, HabitCategory, HabitFrequency } from '../../types';
import { HabitCalendar } from '../calendar/HabitCalendar';
import { StatisticsPanel } from '../statistics/StatisticsPanel';

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  MORNING: 'Morning',
  EVENING: 'Evening',
  OTHER: 'Other',
};

const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
};

export function HabitDetail({ habit, disableCalendarFetch }: HabitDetailProps) {
  const categoryLabel = CATEGORY_LABELS[habit.category];
  const frequencyLabel =
    habit.frequency === 'WEEKLY' && habit.timesPerWeek != null
      ? `${FREQUENCY_LABELS[habit.frequency]} (${habit.timesPerWeek}× per week)`
      : FREQUENCY_LABELS[habit.frequency];

  return (
    <div className="flex flex-col gap-6">
      {/* Habit information */}
      <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">
          {habit.name}
        </h2>
        {habit.description && (
          <p className="mt-2 text-[var(--color-text)]">{habit.description}</p>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div>
            <dt className="inline font-medium text-[var(--color-text)] opacity-80">
              Category:{' '}
            </dt>
            <dd className="inline text-[var(--color-text)]">{categoryLabel}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-[var(--color-text)] opacity-80">
              Frequency:{' '}
            </dt>
            <dd className="inline text-[var(--color-text)]">{frequencyLabel}</dd>
          </div>
          {habit.reminderTime && (
            <div>
              <dt className="inline font-medium text-[var(--color-text)] opacity-80">
                Reminder:{' '}
              </dt>
              <dd className="inline text-[var(--color-text)]">
                {habit.reminderTime}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Calendar view */}
      <HabitCalendar habit={habit} disableFetch={disableCalendarFetch} />

      {/* Statistics panel */}
      <StatisticsPanel habitId={habit.id} />
    </div>
  );
}
