/**
 * Habit Store
 * 
 * Manages habit-related state using Zustand
 */

import { create } from 'zustand';
import type {
  Habit,
  HabitCompletion,
  HabitSkip,
  HabitStatistics,
  HabitCategory,
  CreateHabitDto,
  UpdateHabitDto,
  CreateCompletionDto,
  CreateSkipDto,
  HabitState,
} from '../types';
import { habitService } from '../services/habitService';
import { completionService } from '../services/completionService';
import { skipService } from '../services/skipService';
import statisticsService from '../services/statisticsService';

/** User-friendly message for API errors; treats network errors as "backend unreachable". */
function getApiErrorMessage(err: unknown, fallback: string): string {
  const axiosError = err as { code?: string; response?: { data?: { message?: string } }; message?: string };
  if (axiosError?.code === 'ERR_NETWORK') {
    return 'Cannot reach server. Make sure the backend is running (e.g. npm run dev in the backend folder).';
  }
  return axiosError?.response?.data?.message ?? axiosError?.message ?? fallback;
}

/**
 * Create habit store
 */
export const useHabitStore = create<HabitState>((set, get) => ({
  // Initial state
  habits: [],
  selectedHabit: null,
  completions: {},
  skips: {},
  statistics: {},
  loading: false,
  error: null,

  // Fetch all habits
  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const habits = await habitService.getAll();
      set({ habits, loading: false, error: null });
    } catch (err: unknown) {
      const errorMessage = getApiErrorMessage(err, 'Failed to fetch habits');
      set({ loading: false, error: errorMessage });
    }
  },

  // Fetch habit by ID
  fetchHabitById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const habit = await habitService.getById(id);
      set({ selectedHabit: habit, loading: false, error: null });
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to fetch habit') });
    }
  },

  // Create habit
  createHabit: async (data: CreateHabitDto) => {
    set({ loading: true, error: null });
    try {
      const newHabit = await habitService.create(data);
      set((state) => ({
        habits: [newHabit, ...state.habits],
        loading: false,
        error: null,
      }));
      return newHabit;
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to create habit') });
      throw err;
    }
  },

  // Update habit
  updateHabit: async (id: string, data: UpdateHabitDto) => {
    set({ loading: true, error: null });
    try {
      const updatedHabit = await habitService.update(id, data);
      set((state) => ({
        habits: state.habits.map((habit) => (habit.id === id ? updatedHabit : habit)),
        selectedHabit:
          state.selectedHabit?.id === id ? updatedHabit : state.selectedHabit,
        loading: false,
        error: null,
      }));
      return updatedHabit;
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to update habit') });
      throw err;
    }
  },

  // Delete habit
  deleteHabit: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await habitService.delete(id);
      set((state) => {
        const newCompletions = { ...state.completions };
        const newSkips = { ...state.skips };
        const newStatistics = { ...state.statistics };
        
        // Remove related data
        delete newCompletions[id];
        delete newSkips[id];
        delete newStatistics[id];

        return {
          habits: state.habits.filter((habit) => habit.id !== id),
          selectedHabit: state.selectedHabit?.id === id ? null : state.selectedHabit,
          completions: newCompletions,
          skips: newSkips,
          statistics: newStatistics,
          loading: false,
          error: null,
        };
      });
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to delete habit') });
      throw err;
    }
  },

  // Fetch completions for a habit
  fetchCompletions: async (habitId: string, startDate?: string, endDate?: string) => {
    set({ loading: true, error: null });
    try {
      const completions = await completionService.getAll(habitId, startDate, endDate);
      set((state) => ({
        completions: {
          ...state.completions,
          [habitId]: completions,
        },
        loading: false,
        error: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to fetch completions') });
    }
  },

  // Fetch skips for a habit
  fetchSkips: async (habitId: string, startDate?: string, endDate?: string) => {
    set({ loading: true, error: null });
    try {
      const skips = await skipService.getAll(habitId, startDate, endDate);
      set((state) => ({
        skips: {
          ...state.skips,
          [habitId]: skips,
        },
        loading: false,
        error: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to fetch skips') });
    }
  },

  // Mark habit as complete
  markComplete: async (habitId: string, data: CreateCompletionDto) => {
    set({ loading: true, error: null });
    try {
      const completion = await completionService.create(habitId, data);
      set((state) => {
        const existingCompletions = state.completions[habitId] || [];
        // Check if completion for this date already exists and replace it
        const filteredCompletions = existingCompletions.filter(
          (completionItem) => completionItem.date !== data.date
        );
        return {
          completions: {
            ...state.completions,
            [habitId]: [...filteredCompletions, completion],
          },
          loading: false,
          error: null,
        };
      });
      return completion;
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to mark habit as complete') });
      throw err;
    }
  },

  // Mark habit as skipped
  markSkipped: async (habitId: string, data: CreateSkipDto) => {
    set({ loading: true, error: null });
    try {
      const skip = await skipService.create(habitId, data);
      set((state) => {
        const existingSkips = state.skips[habitId] || [];
        // Check if skip for this date already exists and replace it
        const filteredSkips = existingSkips.filter((skipItem) => skipItem.date !== data.date);
        return {
          skips: {
            ...state.skips,
            [habitId]: [...filteredSkips, skip],
          },
          loading: false,
          error: null,
        };
      });
      return skip;
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to mark habit as skipped') });
      throw err;
    }
  },

  // Remove completion for a date (for calendar toggle)
  removeCompletion: async (habitId: string, date: string) => {
    const state = get();
    const list = state.completions[habitId] || [];
    const entry = list.find((completion) => completion.date === date);
    if (!entry) return;
    try {
      await completionService.delete(entry.id);
      set((prev) => ({
        completions: {
          ...prev.completions,
          [habitId]: (prev.completions[habitId] || []).filter((completion) => completion.date !== date),
        },
      }));
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err, 'Failed to remove completion') });
    }
  },

  // Remove skip for a date (for calendar toggle)
  removeSkip: async (habitId: string, date: string) => {
    const state = get();
    const list = state.skips[habitId] || [];
    const entry = list.find((skipItem) => skipItem.date === date);
    if (!entry) return;
    try {
      await skipService.delete(entry.id);
      set((prev) => ({
        skips: {
          ...prev.skips,
          [habitId]: (prev.skips[habitId] || []).filter((skipItem) => skipItem.date !== date),
        },
      }));
    } catch (err: unknown) {
      set({ error: getApiErrorMessage(err, 'Failed to remove skip') });
    }
  },

  // Fetch statistics for a habit
  fetchStatistics: async (habitId: string) => {
    set({ loading: true, error: null });
    try {
      const stats = await statisticsService.getHabitStatistics(habitId);
      set((state) => ({
        statistics: {
          ...state.statistics,
          [habitId]: stats,
        },
        loading: false,
        error: null,
      }));
    } catch (err: unknown) {
      set({ loading: false, error: getApiErrorMessage(err, 'Failed to fetch statistics') });
    }
  },

  // Filter habits by category
  filterByCategory: (category: HabitCategory | null) => {
    const { habits } = get();
    if (category === null) {
      return habits;
    }
    return habits.filter((habit) => habit.category === category);
  },

  // Set selected habit
  setSelectedHabit: (habit: Habit | null) => {
    set({ selectedHabit: habit });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
