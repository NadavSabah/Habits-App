/**
 * Analytics Service
 * 
 * Handles business logic for calculating habit and user statistics.
 */

import { prisma } from '../utils/prisma';
import { HabitCompletion, HabitSkip, HabitStatistics, UserStatistics } from '../types';

/**
 * Calculate current streak for a habit
 * Counts consecutive days with completion from today backwards
 * Stops when hitting a skip or missing day
 * 
 * @param completions - Array of habit completions
 * @param skips - Array of habit skips
 * @returns Current streak count (number of consecutive days)
 */
export const calculateStreak = (
  completions: HabitCompletion[],
  skips: HabitSkip[]
): number => {
  if (completions.length === 0) {
    return 0;
  }

  // Create sets for quick lookup
  const completionDates = new Set(
    completions.map(c => {
      const date = new Date(c.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    })
  );

  const skipDates = new Set(
    skips.map(s => {
      const date = new Date(s.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    })
  );

  // Start from today and count backwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    // If we hit a skip, stop
    if (skipDates.has(dateStr)) {
      break;
    }

    // If we have a completion, increment streak
    if (completionDates.has(dateStr)) {
      streak++;
    } else {
      // If no completion and no skip, stop (missing day)
      break;
    }

    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

/**
 * Calculate longest streak for a habit
 * Finds all sequences of consecutive completions and returns the longest
 * Skips break streaks, so any skip between completion dates will reset the streak
 * 
 * @param completions - Array of habit completions
 * @param skips - Array of habit skips
 * @returns Longest streak count (number of consecutive days)
 */
export const calculateLongestStreak = (
  completions: HabitCompletion[],
  skips: HabitSkip[]
): number => {
  if (completions.length === 0) {
    return 0;
  }

  // Create sets for quick lookup
  const completionDates = new Set(
    completions.map(c => {
      const date = new Date(c.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  const skipDates = new Set(
    skips.map(s => {
      const date = new Date(s.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  // Sort completion dates chronologically
  const sortedDates = Array.from(completionDates).sort((a, b) => a - b);

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: number | null = null;

  for (const date of sortedDates) {
    // Check if this is consecutive with the last date
    if (lastDate === null) {
      // First completion - start streak
      currentStreak = 1;
      lastDate = date;
      continue;
    }

    const daysDiff = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day - check if there's a skip in between
      // Since we're checking consecutive days, there can't be a skip in between
      // (skips would be on the same day or break the sequence)
      currentStreak++;
    } else {
      // Gap found - check if there are any skips in the gap
      // If there are skips, they break the streak
      // If no skips, it's just a missing day which also breaks the streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1; // Start new streak
    }

    lastDate = date;
  }

  // Check final streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
};

/**
 * Get statistics for a specific habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @returns Habit statistics or null if habit not found
 */
export const getHabitStatistics = async (
  userId: string,
  habitId: string
): Promise<HabitStatistics | null> => {
  // Find habit with completions and skips included
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
    include: {
      completions: true,
      skips: true,
    },
  });

  if (!habit) {
    return null;
  }

  const completions = habit.completions;
  const skips = habit.skips;

  // Calculate statistics
  const totalCompletions = completions.length;
  const totalSkips = skips.length;
  const totalTime = completions.reduce((sum, c) => sum + (c.duration || 0), 0);
  
  // Calculate completion rate (avoid division by zero)
  const totalAttempts = totalCompletions + totalSkips;
  const completionRate = totalAttempts > 0 
    ? (totalCompletions / totalAttempts) * 100 
    : 0;

  // Calculate streaks
  const currentStreak = calculateStreak(completions, skips);
  const longestStreak = calculateLongestStreak(completions, skips);

  return {
    totalCompletions,
    totalSkips,
    totalTime,
    completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
    currentStreak,
    longestStreak,
  };
};

/**
 * Get overall statistics for a user across all habits
 * @param userId - User's unique identifier
 * @returns User statistics
 */
export const getUserStatistics = async (
  userId: string
): Promise<UserStatistics> => {
  // Find all habits with completions and skips
  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    include: {
      completions: true,
      skips: true,
    },
  });

  // Calculate totals across all habits
  const totalHabits = habits.length;
  
  let totalCompletions = 0;
  let totalSkips = 0;
  let totalTime = 0;
  const completionRates: number[] = [];

  for (const habit of habits) {
    const habitCompletions = habit.completions.length;
    const habitSkips = habit.skips.length;
    const habitTotalAttempts = habitCompletions + habitSkips;
    
    totalCompletions += habitCompletions;
    totalSkips += habitSkips;
    totalTime += habit.completions.reduce((sum, c) => sum + (c.duration || 0), 0);

    // Calculate completion rate for this habit
    if (habitTotalAttempts > 0) {
      const habitCompletionRate = (habitCompletions / habitTotalAttempts) * 100;
      completionRates.push(habitCompletionRate);
    }
  }

  // Calculate average completion rate
  const averageCompletionRate = completionRates.length > 0
    ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
    : 0;

  return {
    totalHabits,
    totalCompletions,
    totalSkips,
    totalTime,
    averageCompletionRate: Math.round(averageCompletionRate * 100) / 100, // Round to 2 decimal places
  };
};

// Export service object with all functions
export const analyticsService = {
  calculateStreak,
  calculateLongestStreak,
  getHabitStatistics,
  getUserStatistics,
};
