/**
 * Completion Service
 * 
 * Handles business logic for habit completion operations (CRUD).
 */

import { prisma } from '../utils/prisma';
import { HabitCompletion } from '../types';
import { CompletionInput } from '../utils/validation.util';

/**
 * Create a new completion for a habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @param data - Completion data (date, duration, notes)
 * @returns Created completion
 * @throws Error if habit doesn't belong to user or completion already exists
 */
export const createCompletion = async (
  userId: string,
  habitId: string,
  data: CompletionInput
): Promise<HabitCompletion> => {
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

  // Check if completion already exists for that date
  const existingCompletion = await prisma.habitCompletion.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: new Date(data.date),
      },
    },
  });

  if (existingCompletion) {
    throw new Error('Completion already exists for this date');
  }

  // Create completion
  const completion = await prisma.habitCompletion.create({
    data: {
      habitId,
      date: new Date(data.date),
      duration: data.duration,
      notes: data.notes,
    },
  });

  return completion;
};

/**
 * Get all completions for a habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @param startDate - Optional start date for filtering (YYYY-MM-DD format)
 * @param endDate - Optional end date for filtering (YYYY-MM-DD format)
 * @returns Array of completions
 */
export const getCompletions = async (
  userId: string,
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitCompletion[]> => {
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

  // Query completions
  const completions = await prisma.habitCompletion.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return completions;
};

/**
 * Delete a completion
 * @param userId - User's unique identifier
 * @param completionId - Completion's unique identifier
 * @returns true if completion was deleted, false if not found or doesn't belong to user
 */
export const deleteCompletion = async (
  userId: string,
  completionId: string
): Promise<boolean> => {
  // Find completion and verify habit belongs to user
  const completion = await prisma.habitCompletion.findUnique({
    where: { id: completionId },
    include: {
      habit: true,
    },
  });

  if (!completion || completion.habit.userId !== userId) {
    return false;
  }

  // Delete completion
  await prisma.habitCompletion.delete({
    where: { id: completionId },
  });

  return true;
};

// Export service object with all functions
export const completionService = {
  createCompletion,
  getCompletions,
  deleteCompletion,
};
