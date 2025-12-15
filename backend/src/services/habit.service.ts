/**
 * Habit Service
 * 
 * Handles business logic for habit operations (CRUD).
 */

import { prisma } from '../utils/prisma';
import { Habit } from '../types';
import { CreateHabitInput, UpdateHabitInput } from '../utils/validation.util';

/**
 * Get all habits for a user
 * @param userId - User's unique identifier
 * @returns Array of habits ordered by creation date (newest first)
 */
export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return habits;
};

/**
 * Get a specific habit by ID (verifying it belongs to the user)
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @returns Habit if found and belongs to user, null otherwise
 */
export const getHabitById = async (
  userId: string,
  habitId: string
): Promise<Habit | null> => {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  return habit;
};

/**
 * Create a new habit
 * @param userId - User's unique identifier
 * @param data - Habit creation data
 * @returns Created habit
 */
export const createHabit = async (
  userId: string,
  data: CreateHabitInput
): Promise<Habit> => {
  const habit = await prisma.habit.create({
    data: {
      ...data,
      userId,
    },
  });

  return habit;
};

/**
 * Update an existing habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @param data - Habit update data (all fields optional)
 * @returns Updated habit if found and belongs to user, null otherwise
 */
export const updateHabit = async (
  userId: string,
  habitId: string,
  data: UpdateHabitInput
): Promise<Habit | null> => {
  // Verify habit belongs to user
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!existingHabit) {
    return null;
  }

  // Update the habit
  const updatedHabit = await prisma.habit.update({
    where: { id: habitId },
    data,
  });

  return updatedHabit;
};

/**
 * Delete a habit
 * @param userId - User's unique identifier
 * @param habitId - Habit's unique identifier
 * @returns true if habit was deleted, false if not found or doesn't belong to user
 */
export const deleteHabit = async (
  userId: string,
  habitId: string
): Promise<boolean> => {
  // Verify habit belongs to user
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!existingHabit) {
    return false;
  }

  // Delete the habit (cascade will handle related completions, skips, etc.)
  await prisma.habit.delete({
    where: { id: habitId },
  });

  return true;
};

// Export service object with all functions
export const habitService = {
  getUserHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
};
