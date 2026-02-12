/**
 * Habit List Component
 *
 * Fetches habits on mount, renders HabitCard list. Optional category filter.
 * Shows loading state and empty state.
 */

import { useEffect } from 'react';
import { format } from 'date-fns';
import type { HabitListProps } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useHabitStore } from '../../store/habitStore';
import { HabitCard } from './HabitCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function HabitList({
  selectedCategory = null,
  onHabitClick,
  onHabitEdit,
  onHabitDelete,
}: HabitListProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completions = useHabitStore((state) => state.completions);
  const loading = useHabitStore((state) => state.loading);
  const error = useHabitStore((state) => state.error);
  const fetchHabits = useHabitStore((state) => state.fetchHabits);
  const filterByCategory = useHabitStore((state) => state.filterByCategory);

  const filteredHabits = filterByCategory(selectedCategory);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits();
    }
  }, [isAuthenticated, fetchHabits]);

  if (!isAuthenticated) {
    return (
      <div className="rounded-card bg-white py-12 text-center shadow-sm">
        <p className="text-[var(--color-text)]">Log in to see your habits.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (filteredHabits.length === 0) {
    return (
      <div className="rounded-card bg-white py-12 text-center shadow-sm">
        <p className="text-[var(--color-text)]">No habits yet.</p>
        <p className="mt-1 text-sm text-[var(--color-text)] opacity-80">
          Create your first habit to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4" role="list">
      {filteredHabits.map((habit) => {
        const habitCompletions = completions[habit.id];
        const completedToday =
          habitCompletions?.some((completion) => completion.date === today) ?? false;

        return (
          <li key={habit.id}>
            <HabitCard
              habit={habit}
              completedToday={completedToday}
              onClick={() => onHabitClick?.(habit)}
              onEdit={onHabitEdit ? () => onHabitEdit(habit) : undefined}
              onDelete={onHabitDelete ? () => onHabitDelete(habit) : undefined}
            />
          </li>
        );
      })}
    </ul>
  );
}
