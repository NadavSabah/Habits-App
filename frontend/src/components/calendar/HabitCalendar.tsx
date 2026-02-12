/**
 * Habit Calendar Component
 *
 * Month calendar with completions/skips per day. Day click toggles
 * completed → skipped → pending. Uses CalendarDay and habit store.
 */

import { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import type { HabitCalendarProps } from '../../types';
import type { CalendarDayStatus } from '../../types';
import type { HabitCompletion, HabitSkip } from '../../types';
import { useHabitStore } from '../../store/habitStore';
import { CalendarDay } from './CalendarDay';
import { Button } from '../common/Button';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Stable empty arrays so selectors don't return a new reference and cause an infinite loop. */
const EMPTY_COMPLETIONS: HabitCompletion[] = [];
const EMPTY_SKIPS: HabitSkip[] = [];

export function HabitCalendar({ habit, disableFetch = false }: HabitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const completions = useHabitStore((state) => state.completions[habit.id] ?? EMPTY_COMPLETIONS);
  const skips = useHabitStore((state) => state.skips[habit.id] ?? EMPTY_SKIPS);
  const fetchCompletions = useHabitStore((state) => state.fetchCompletions);
  const fetchSkips = useHabitStore((state) => state.fetchSkips);
  const markComplete = useHabitStore((state) => state.markComplete);
  const markSkipped = useHabitStore((state) => state.markSkipped);
  const removeCompletion = useHabitStore((state) => state.removeCompletion);
  const removeSkip = useHabitStore((state) => state.removeSkip);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Use stable string key so effect doesn't run every render (Date refs would change every time)
  const monthKey = format(currentMonth, 'yyyy-MM');

  useEffect(() => {
    if (disableFetch) return;
    const startStr = `${monthKey}-01`;
    const endStr = format(endOfMonth(new Date(`${monthKey}-01`)), 'yyyy-MM-dd');
    fetchCompletions(habit.id, startStr, endStr);
    fetchSkips(habit.id, startStr, endStr);
  }, [habit.id, monthKey, disableFetch, fetchCompletions, fetchSkips]);

  function getDayStatus(date: Date): CalendarDayStatus {
    const dateStr = format(date, 'yyyy-MM-dd');
    const matchDate = (dateValue: string) => dateValue.slice(0, 10) === dateStr;
    if (completions.some((completion) => matchDate(completion.date))) return 'completed';
    if (skips.some((skipItem) => matchDate(skipItem.date))) return 'skipped';
    return 'pending';
  }

  async function handleDayClick(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const status = getDayStatus(date);

    if (status === 'pending') {
      await markComplete(habit.id, { date: dateStr });
    } else if (status === 'completed') {
      await removeCompletion(habit.id, dateStr);
      await markSkipped(habit.id, { date: dateStr });
    } else {
      await removeSkip(habit.id, dateStr);
    }
  }

  const today = new Date();

  return (
    <div className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
            className="min-w-0 px-3 py-1.5 text-sm"
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
            className="min-w-0 px-3 py-1.5 text-sm"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-xs font-medium text-[var(--color-text)] opacity-70"
          >
            {label}
          </div>
        ))}
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            status={getDayStatus(day)}
            onClick={() => handleDayClick(day)}
            isToday={isSameDay(day, today)}
            isCurrentMonth={isSameMonth(day, currentMonth)}
          />
        ))}
      </div>
    </div>
  );
}
