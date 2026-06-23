/**
 * Dashboard Page
 *
 * Main app view: habit list, category filter, and create-habit modal.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HabitCategory } from '../types';
import { HabitList } from '../components/habits/HabitList';
import { HabitCategoryFilter } from '../components/habits/HabitCategoryFilter';
import { HabitForm } from '../components/habits/HabitForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useHabitStore } from '../store/habitStore';

export function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
  const navigate = useNavigate();
  const setSelectedHabit = useHabitStore((state) => state.setSelectedHabit);

  const handleHabitClick = (habit: { id: string }) => {
    setSelectedHabit(habit);
    navigate(`/habits/${habit.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
          Habits
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create habit
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </div>
      </header>

      <div className="max-w-2xl space-y-4">
        <HabitCategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <HabitList
          selectedCategory={selectedCategory}
          onHabitClick={handleHabitClick}
          onHabitEdit={(habit) => {
            setSelectedHabit(habit);
            navigate(`/habits/${habit.id}`);
          }}
          onHabitDelete={() => {}}
        />
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create habit"
      >
        <HabitForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
