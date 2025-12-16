/**
 * Skip Service
 * 
 * Handles business logic for habit skip operations (CRUD).
 */

import { prisma } from '../utils/prisma';
import { HabitSkip } from '../types';
import { SkipInput } from '../utils/validation.util';

/**
 * Create a new skip for a habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @param data - Skip data (date, reason)
 * @returns Created skip
 * @throws Error if habit doesn't belong to user or skip already exists
 */
export const createSkip = async (
  userId: string,
  habitId: string,
  data: SkipInput
): Promise<HabitSkip> => {
  // Verify habit belongs to user
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error('Habit not found or does not belong to user');
  }

  // Check if skip already exists for that date
  const existingSkip = await prisma.habitSkip.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: new Date(data.date),
      },
    },
  });

  if (existingSkip) {
    throw new Error('Skip already exists for this date');
  }

  // Create skip
  const skip = await prisma.habitSkip.create({
    data: {
      habitId,
      date: new Date(data.date),
      reason: data.reason,
    },
  });

  return skip;
};

/**
 * Get all skips for a habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @param startDate - Optional start date for filtering (YYYY-MM-DD format)
 * @param endDate - Optional end date for filtering (YYYY-MM-DD format)
 * @returns Array of skips
 */
export const getSkips = async (
  userId: string,
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitSkip[]> => {
  // Verify habit belongs to user
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error('Habit not found or does not belong to user');
  }

  // Build where clause with date range if provided
  const where: any = {
    habitId,
  };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      // Set to end of day for inclusive end date
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  // Query skips
  const skips = await prisma.habitSkip.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return skips;
};

/**
 * Delete a skip
 * @param userId - User's unique identifier
 * @param skipId - Skip's unique identifier
 * @returns true if skip was deleted, false if not found or doesn't belong to user
 */
export const deleteSkip = async (
  userId: string,
  skipId: string
): Promise<boolean> => {
  // Find skip and verify habit belongs to user
  const skip = await prisma.habitSkip.findUnique({
    where: { id: skipId },
    include: {
      habit: true,
    },
  });

  if (!skip || skip.habit.userId !== userId) {
    return false;
  }

  // Delete skip
  await prisma.habitSkip.delete({
    where: { id: skipId },
  });

  return true;
};

// Export service object with all functions
export const skipService = {
  createSkip,
  getSkips,
  deleteSkip,
};
