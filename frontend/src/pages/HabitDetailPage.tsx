/**
 * Habit Detail Page
 *
 * Shows a single habit (calendar, stats). Fetches habit by URL param; 404 if not found.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HabitDetail } from '../components/habits/HabitDetail';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useHabitStore } from '../store/habitStore';

export function HabitDetailPage() {
  const { id: habitId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habits = useHabitStore((state) => state.habits);
  const selectedHabit = useHabitStore((state) => state.selectedHabit);
  const loading = useHabitStore((state) => state.loading);
  const fetchHabitById = useHabitStore((state) => state.fetchHabitById);

  const habit = habitId
    ? habits.find((habitItem) => habitItem.id === habitId) ??
      (selectedHabit?.id === habitId ? selectedHabit : null)
    : null;

  useEffect(() => {
    if (habitId) {
      fetchHabitById(habitId);
    }
  }, [habitId, fetchHabitById]);

  if (!habitId) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  if (loading && !habit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-[var(--color-text)]">Loading habit…</p>
        </div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] p-6">
        <div className="rounded-card border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-[var(--color-text-heading)]">
            Habit not found
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text)]">
            This habit does not exist or you don’t have access to it.
          </p>
          <Button type="button" variant="primary" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-6">
      <div className="mb-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </Button>
      </div>
      <div className="max-w-2xl">
        <HabitDetail habit={habit} />
      </div>
    </div>
  );
}
