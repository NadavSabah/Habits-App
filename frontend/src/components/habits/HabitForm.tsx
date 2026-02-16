/**
 * Habit Form Component
 *
 * Create or edit a habit. Used in a modal or inline.
 * Validates and calls habit store create/update; closes on success.
 */

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { HabitFormProps, HabitCategory, HabitFrequency, CreateHabitDto, UpdateHabitDto } from '../../types';
import { useHabitStore } from '../../store/habitStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const categoryOptions: { value: HabitCategory; label: string }[] = [
  { value: 'MORNING', label: 'Morning' },
  { value: 'EVENING', label: 'Evening' },
  { value: 'OTHER', label: 'Other' },
];

const frequencyOptions: { value: HabitFrequency; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
];

const inputBaseClasses =
  'block w-full rounded-card border border-gray-300 bg-white px-3 py-2.5 text-[var(--color-text)] placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function HabitForm({ habitId, onClose }: HabitFormProps) {
  const habits = useHabitStore((state) => state.habits);
  const selectedHabit = useHabitStore((state) => state.selectedHabit);
  const fetchHabitById = useHabitStore((state) => state.fetchHabitById);
  const createHabit = useHabitStore((state) => state.createHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const loading = useHabitStore((state) => state.loading);
  const error = useHabitStore((state) => state.error);
  const clearError = useHabitStore((state) => state.clearError);

  const habit = habitId
    ? habits.find((habitItem) => habitItem.id === habitId) ?? (selectedHabit?.id === habitId ? selectedHabit : null)
    : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('MORNING');
  const [frequency, setFrequency] = useState<HabitFrequency>('DAILY');
  const [timesPerWeek, setTimesPerWeek] = useState('3');
  const [timesPerDay, setTimesPerDay] = useState('1');
  const [reminderTime, setReminderTime] = useState('');
  const [initialized, setInitialized] = useState(false);

  const isEditMode = Boolean(habitId);

  // Load habit when editing and not yet in state
  useEffect(() => {
    if (habitId && !habit) {
      fetchHabitById(habitId);
    }
  }, [habitId, habit, fetchHabitById]);

  // Initialize form from habit when editing
  useEffect(() => {
    if (habit && isEditMode && !initialized) {
      setName(habit.name);
      setDescription(habit.description ?? '');
      setCategory(habit.category);
      setFrequency(habit.frequency);
      setTimesPerWeek(String(habit.timesPerWeek ?? 3));
      setTimesPerDay(String(habit.timesPerDay ?? 1));
      setReminderTime(habit.reminderTime ?? '');
      setInitialized(true);
    }
  }, [habit, isEditMode, initialized]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (isEditMode && habitId) {
      const data: UpdateHabitDto = {
        name: trimmedName,
        category,
        frequency,
      };
      if (description.trim()) data.description = description.trim();
      if (frequency === 'WEEKLY') {
        const weekNum = parseInt(timesPerWeek, 10);
        if (!Number.isNaN(weekNum) && weekNum >= 1 && weekNum <= 7) data.timesPerWeek = weekNum;
      }
      if (frequency === 'DAILY') {
        const dayNum = parseInt(timesPerDay, 10);
        if (!Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 24) data.timesPerDay = dayNum;
      }
      if (reminderTime) data.reminderTime = reminderTime;
      try {
        await updateHabit(habitId, data);
        onClose();
      } catch {
        // Error shown from store
      }
    } else {
      const data: CreateHabitDto = {
        name: trimmedName,
        category,
        frequency,
      };
      if (description.trim()) data.description = description.trim();
      if (frequency === 'WEEKLY') {
        const weekNum = parseInt(timesPerWeek, 10);
        if (!Number.isNaN(weekNum) && weekNum >= 1 && weekNum <= 7) data.timesPerWeek = weekNum;
      }
      if (frequency === 'DAILY') {
        const dayNum = parseInt(timesPerDay, 10);
        if (!Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 24) data.timesPerDay = dayNum;
      }
      if (reminderTime) data.reminderTime = reminderTime;
      try {
        await createHabit(data);
        onClose();
      } catch {
        // Error shown from store
      }
    }
  };

  if (isEditMode && habitId && !habit) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[var(--color-text)]">Loading habit…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="e.g. Drink water"
        required
      />
      <div>
        <label htmlFor="habit-description" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Description (optional)
        </label>
        <textarea
          id="habit-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Short description"
          rows={3}
          className={inputBaseClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Category
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as HabitCategory)}
          className={`${inputBaseClasses} py-2`}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Frequency
        </label>
        <select
          value={frequency}
          onChange={(event) => setFrequency(event.target.value as HabitFrequency)}
          className={`${inputBaseClasses} py-2`}
        >
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {frequency === 'WEEKLY' && (
        <Input
          label="Times per week (1–7)"
          type="number"
          min={1}
          max={7}
          value={timesPerWeek}
          onChange={(event) => setTimesPerWeek(event.target.value)}
        />
      )}
      {frequency === 'DAILY' && (
        <Input
          label="Times per day (1–24)"
          type="number"
          min={1}
          max={24}
          value={timesPerDay}
          onChange={(event) => setTimesPerDay(event.target.value)}
        />
      )}
      <div>
        <label htmlFor="habit-reminder" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Reminder time (optional)
        </label>
        <input
          id="habit-reminder"
          type="time"
          value={reminderTime}
          onChange={(event) => setReminderTime(event.target.value)}
          className={inputBaseClasses}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
          {loading ? (isEditMode ? 'Saving…' : 'Creating…') : isEditMode ? 'Save habit' : 'Create habit'}
        </Button>
      </div>
    </form>
  );
}
