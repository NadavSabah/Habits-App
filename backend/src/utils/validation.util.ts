/**
 * Validation Utility Functions
 * 
 * Zod schemas for validating request data.
 */

import { z } from 'zod';

/**
 * Schema for user registration
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  name: z.string().min(1, 'Name cannot be empty').max(100).optional(),
});

/**
 * Schema for user login
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for creating a habit
 */
export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, 'Habit name is required')
    .max(100, 'Habit name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  category: z.enum(['MORNING', 'EVENING', 'OTHER'], {
    errorMap: () => ({ message: 'Category must be MORNING, EVENING, or OTHER' }),
  }),
  frequency: z.enum(['DAILY', 'WEEKLY'], {
    errorMap: () => ({ message: 'Frequency must be DAILY or WEEKLY' }),
  }),
  timesPerWeek: z
    .number()
    .int()
    .min(1, 'Times per week must be at least 1')
    .max(7, 'Times per week cannot exceed 7')
    .optional(),
  timesPerDay: z
    .number()
    .int()
    .min(1, 'Times per day must be at least 1')
    .max(24, 'Times per day cannot exceed 24')
    .optional(),
  timesPerMonth: z
    .number()
    .int()
    .min(1, 'Times per month must be at least 1')
    .max(31, 'Times per month cannot exceed 31')
    .optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Reminder time must be in HH:mm format')
    .optional(),
});

/**
 * Schema for updating a habit (all fields optional)
 */
export const updateHabitSchema = createHabitSchema.partial();

/**
 * Schema for marking a habit completion
 */
export const completionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  duration: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours (1440 minutes)')
    .optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

/**
 * Schema for marking a habit skip
 */
export const skipSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

/**
 * Type inference helpers
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CompletionInput = z.infer<typeof completionSchema>;
export type SkipInput = z.infer<typeof skipSchema>;

