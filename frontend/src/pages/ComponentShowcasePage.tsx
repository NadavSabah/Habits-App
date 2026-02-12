/**
 * Component showcase – Buttons, Inputs, and more from the common design system.
 * Use this to verify design and behaviour (Design/README.md).
 */

import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitCategoryFilter } from '../components/habits/HabitCategoryFilter';
import { HabitDetail } from '../components/habits/HabitDetail';
import { HabitList } from '../components/habits/HabitList';
import { CalendarDay } from '../components/calendar/CalendarDay';
import { HabitCalendar } from '../components/calendar/HabitCalendar';
import { CalendarView } from '../components/calendar/CalendarView';
import { useHabitStore } from '../store/habitStore';
import type { Habit, CreateHabitDto, HabitCategory, HabitFrequency } from '../types';

const mockMorningHabit: Habit = {
  id: '1',
  userId: 'user-1',
  name: 'Drink Water',
  category: 'MORNING',
  frequency: 'DAILY',
};

const mockEveningHabit: Habit = {
  id: '2',
  userId: 'user-1',
  name: 'Read 10 Pages',
  category: 'EVENING',
  frequency: 'WEEKLY',
  timesPerWeek: 5,
};

const mockOtherHabit: Habit = {
  id: '3',
  userId: 'user-1',
  name: 'Evening Run',
  category: 'OTHER',
  frequency: 'DAILY',
};

/** Mock habit for HabitDetail showcase (has description, weekly, reminder). */
const mockDetailHabit: Habit = {
  id: 'detail-1',
  userId: 'user-1',
  name: 'Read 10 Pages',
  description: 'Read at least 10 pages of a book.',
  category: 'EVENING',
  frequency: 'WEEKLY',
  timesPerWeek: 5,
  reminderTime: '21:00',
};

export function ComponentShowcasePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [telValue, setTelValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [habitListCategory, setHabitListCategory] = useState<HabitCategory | null>(null);

  // Create habit form (only relevant when logged in)
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('MORNING');
  const [habitFrequency, setHabitFrequency] = useState<HabitFrequency>('DAILY');
  const [habitTimesPerWeek, setHabitTimesPerWeek] = useState<string>('3');
  const createHabit = useHabitStore((state) => state.createHabit);
  const createHabitLoading = useHabitStore((state) => state.loading);
  const createHabitError = useHabitStore((state) => state.error);
  const clearError = useHabitStore((state) => state.clearError);
  const setSelectedHabit = useHabitStore((state) => state.setSelectedHabit);

  const handleCreateHabit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    const data: CreateHabitDto = {
      name: habitName.trim(),
      category: habitCategory,
      frequency: habitFrequency,
    };
    if (habitDescription.trim()) data.description = habitDescription.trim();
    if (habitFrequency === 'WEEKLY') {
      const times = parseInt(habitTimesPerWeek, 10);
      if (!Number.isNaN(times) && times >= 1 && times <= 7) data.timesPerWeek = times;
    }
    try {
      await createHabit(data);
      setHabitName('');
      setHabitDescription('');
      setHabitCategory('MORNING');
      setHabitFrequency('DAILY');
      setHabitTimesPerWeek('3');
    } catch {
      // Error is in store, form stays open
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-text-heading)]">
        Component showcase
      </h1>
      <p className="mb-8 text-[var(--color-text)]">
        Buttons, inputs, modal, loading spinner, auth forms, habit cards, and habit list from the
        common components (Design/README.md).
      </p>

      {/* Login Form */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-semibold text-[var(--color-text-heading)]">
          Login form
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text)] opacity-80">
          Fake data: demo@example.com / password123
        </p>
        <div className="rounded-card bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </section>

      {/* Register Form */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Register form
        </h2>
        <div className="rounded-card bg-white p-6 shadow-sm">
          <RegisterForm />
        </div>
      </section>

      {/* Create habit (when logged in) */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Create habit
        </h2>
        <div className="max-w-md">
          <form
            onSubmit={handleCreateHabit}
            className="rounded-card flex flex-col gap-4 bg-white p-6 shadow-sm"
          >
            <Input
              label="Name"
              type="text"
              value={habitName}
              onChange={(event) => setHabitName(event.target.value)}
              placeholder="e.g. Drink water"
              required
            />
            <Input
              label="Description (optional)"
              type="text"
              value={habitDescription}
              onChange={(event) => setHabitDescription(event.target.value)}
              placeholder="Short description"
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Category
              </label>
              <select
                value={habitCategory}
                onChange={(event) => setHabitCategory(event.target.value as HabitCategory)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[var(--color-text)]"
              >
                <option value="MORNING">Morning</option>
                <option value="EVENING">Evening</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Frequency
              </label>
              <select
                value={habitFrequency}
                onChange={(event) => setHabitFrequency(event.target.value as HabitFrequency)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[var(--color-text)]"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
            {habitFrequency === 'WEEKLY' && (
              <Input
                label="Times per week (1–7)"
                type="number"
                min={1}
                max={7}
                value={habitTimesPerWeek}
                onChange={(event) => setHabitTimesPerWeek(event.target.value)}
              />
            )}
            {createHabitError && (
              <p className="text-sm text-red-600" role="alert">
                {createHabitError}
              </p>
            )}
            <Button type="submit" variant="primary" disabled={createHabitLoading || !habitName.trim()}>
              {createHabitLoading ? 'Creating…' : 'Create habit'}
            </Button>
          </form>
        </div>
      </section>

      {/* Habit List */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Habit list
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">
          Log in (e.g. demo@example.com / password123 after running the seed) to see habits from the database.
          Click a habit to select it; the Calendar view below will show that habit’s calendar.
        </p>
        <div className="max-w-md space-y-4">
          <HabitCategoryFilter
            selectedCategory={habitListCategory}
            onCategoryChange={setHabitListCategory}
          />
          <HabitList
            selectedCategory={habitListCategory}
            onHabitClick={setSelectedHabit}
            onHabitEdit={() => {}}
            onHabitDelete={() => {}}
          />
        </div>
      </section>
            {/* Calendar View */}
            <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Calendar view
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">
          Wrapper that shows the selected habit’s calendar from the store. When no habit is selected, shows a message.
        </p>
        <div className="max-w-md">
          <CalendarView />
        </div>
      </section>

      {/* Habit Detail */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Habit detail
        </h2>
        <div className="max-w-2xl">
          <HabitDetail habit={mockDetailHabit} disableCalendarFetch />
        </div>
      </section>

      {/* Calendar Day */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Calendar day
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">
          Completed (green), skipped (gray), pending (white). Today has a ring.
        </p>
        <div className="flex max-w-md flex-wrap gap-2">
          <CalendarDay
            date={new Date()}
            status="completed"
            onClick={() => {}}
            isToday
            isCurrentMonth
          />
          <CalendarDay
            date={new Date(Date.now() - 86400000)}
            status="skipped"
            onClick={() => {}}
            isCurrentMonth
          />
          <CalendarDay
            date={new Date(Date.now() + 86400000)}
            status="pending"
            onClick={() => {}}
            isCurrentMonth
          />
          <CalendarDay
            date={new Date(Date.now() + 2 * 86400000)}
            status="pending"
            onClick={() => {}}
            isToday={false}
            isCurrentMonth={false}
          />
        </div>
      </section>

      {/* Habit Calendar */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Habit calendar
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text)] opacity-80">
          Month view with Prev/Next. Click a day to toggle completed → skipped → pending (requires login and a real habit).
        </p>
        <div className="max-w-md">
          <HabitCalendar habit={mockDetailHabit} disableFetch />
        </div>
      </section>



      {/* Habit Cards */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Habit cards
        </h2>
        <div className="flex max-w-md flex-col gap-4">
          <HabitCard
            habit={mockMorningHabit}
            completedToday
            onClick={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <HabitCard
            habit={mockEveningHabit}
            completedToday={false}
            onClick={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          <HabitCard
            habit={mockOtherHabit}
            completedToday={false}
            onClick={() => {}}
          />
        </div>
      </section>

      {/* Loading Spinner */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Loading spinner
        </h2>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-[var(--color-text)]">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="md" />
            <span className="text-sm text-[var(--color-text)]">md (default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-[var(--color-text)]">lg</span>
          </div>
        </div>
      </section>

      {/* Modal */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Modal
        </h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
          <p className="mb-4 text-[var(--color-text)]">
            Backdrop click or Escape closes this modal. Content goes here.
          </p>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Buttons
        </h2>
        <h3 className="mb-4 text-lg font-medium text-[var(--color-text-heading)]">By variant</h3>
        <div className="mb-10 flex flex-wrap gap-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-[var(--color-text)]">Primary</span>
            <Button variant="primary" onClick={() => {}}>
              Log In
            </Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-[var(--color-text)]">Secondary</span>
            <Button variant="secondary" onClick={() => {}}>
              Morning
            </Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-[var(--color-text)]">Success</span>
            <Button variant="success" onClick={() => {}}>
              Mark Done
            </Button>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-[var(--color-text)]">Danger</span>
            <Button variant="danger" onClick={() => {}}>
              Delete
            </Button>
          </div>
        </div>
        <h3 className="mb-4 text-lg font-medium text-[var(--color-text-heading)]">Disabled</h3>
        <div className="mb-10 flex flex-wrap gap-4">
          <Button variant="primary" disabled>
            Primary disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary disabled
          </Button>
        </div>
        <h3 className="mb-4 text-lg font-medium text-[var(--color-text-heading)]">Types</h3>
        <div className="flex flex-wrap gap-4">
          <Button type="button" variant="primary">
            type="button"
          </Button>
          <Button type="submit" variant="primary">
            type="submit"
          </Button>
          <Button type="reset" variant="secondary">
            type="reset"
          </Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-heading)]">
          Inputs
        </h2>
        <div className="grid max-w-md gap-8">
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Text (with label)</h3>
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Email</h3>
            <Input
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">
              Password (with visibility toggle)
            </h3>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Search</h3>
            <Input
              label="Search"
              type="search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Number</h3>
            <Input
              label="Amount"
              type="number"
              placeholder="0"
              min={0}
              value={numberValue}
              onChange={(event) => setNumberValue(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Tel</h3>
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={telValue}
              onChange={(event) => setTelValue(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">URL</h3>
            <Input
              label="Website"
              type="url"
              placeholder="https://example.com"
              value={urlValue}
              onChange={(event) => setUrlValue(event.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">
              Without label (placeholder only)
            </h3>
            <Input type="text" placeholder="Placeholder only" />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">With error</h3>
            <Input
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              error="Please enter a valid email address."
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Disabled</h3>
            <Input label="Disabled field" type="text" placeholder="Cannot edit" disabled />
          </div>
        </div>
      </section>
    </div>
  );
}
