/**
 * Calendar Day Component
 *
 * Renders a single day cell: day number, status (completed/skipped/pending),
 * highlights today, dims other months. Used by HabitCalendar.
 */

import type { CalendarDayProps } from '../../types';
import { format } from 'date-fns';

const statusClasses: Record<CalendarDayProps['status'], string> = {
  completed: 'bg-emerald-500 text-white hover:bg-emerald-600',
  skipped: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
  pending: 'bg-white text-[var(--color-text)] hover:bg-gray-100 border border-gray-200',
};

export function CalendarDay({
  date,
  status,
  onClick,
  isToday = false,
  isCurrentMonth = true,
}: CalendarDayProps) {
  const dayNumber = format(date, 'd');
  const statusClass = statusClasses[status];
  const opacityClass = isCurrentMonth ? '' : 'opacity-40';
  const todayRing = isToday ? 'ring-2 ring-primary ring-offset-1' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex aspect-square min-w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${statusClass} ${opacityClass} ${todayRing}`}
      aria-label={`${format(date, 'EEEE, MMMM d')} – ${status}`}
      aria-pressed={status === 'completed'}
    >
      {dayNumber}
    </button>
  );
}
