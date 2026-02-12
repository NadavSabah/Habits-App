/**
 * Calendar View Component
 *
 * Wraps HabitCalendar and shows it for the selected habit from the store.
 * Shows a message when no habit is selected. Includes a color map (legend).
 */

import { useHabitStore } from '../../store/habitStore';
import { HabitCalendar } from './HabitCalendar';

const COLOR_MAP_ITEMS: { status: 'completed' | 'skipped' | 'pending'; label: string; className: string }[] = [
  { status: 'completed', label: 'Completed', className: 'bg-emerald-500' },
  { status: 'skipped', label: 'Skipped', className: 'bg-gray-300' },
  { status: 'pending', label: 'Pending', className: 'bg-white border border-gray-200' },
];

function CalendarColorMap() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text)]">
      {COLOR_MAP_ITEMS.map((item) => (
        <div key={item.status} className="flex items-center gap-2">
          <span
            className={`inline-block h-5 w-5 shrink-0 rounded ${item.className} ${item.status === 'pending' ? 'text-[var(--color-text)]' : ''}`}
            aria-hidden
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CalendarView() {
  const selectedHabit = useHabitStore((state) => state.selectedHabit);

  if (!selectedHabit) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
        <p>Select a habit to view its calendar.</p>
      </div>
    );
  }

  return (
    <div>
      <HabitCalendar habit={selectedHabit} />
      <CalendarColorMap />
    </div>
  );
}
