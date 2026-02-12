/**
 * Backend Type Definitions
 * 
 * This file exports all Prisma-generated types and defines additional
 * backend-specific types for the application.
 */

import type { Request } from 'express';
import type { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  createHabitSchema,
  updateHabitSchema,
  completionSchema,
  skipSchema,
} from '../utils/validation.util';

// Export all types from Prisma Client
export * from '@prisma/client';

// Explicitly re-export commonly used Prisma types for better IDE support
export type {
  Habit,
  User,
  HabitCompletion,
  HabitSkip,
  NotificationSubscription,
  HabitCategory,
  HabitFrequency,
} from '@prisma/client';

// Additional backend-specific type definitions

/**
 * Authentication Response
 * Returned after successful login or registration
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  token: string;
}

/**
 * JWT Payload
 * Structure of the decoded JWT token
 */
export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * API Error Response
 * Standard error response structure
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Pagination Options
 * For paginated API responses
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated Response
 * Standard structure for paginated responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Date Range Query
 * For filtering by date ranges
 */
export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

/**
 * Habit Statistics
 * Calculated statistics for a habit
 */
export interface HabitStatistics {
  totalCompletions: number;
  totalSkips: number;
  totalTime: number; // in minutes
  completionRate: number; // percentage
  currentStreak: number; // consecutive days
  longestStreak: number; // consecutive days
}

/**
 * User Statistics
 * Overall statistics for a user across all habits
 */
export interface UserStatistics {
  totalHabits: number;
  totalCompletions: number;
  totalSkips: number;
  totalTime: number; // in minutes
  averageCompletionRate: number; // percentage
}

/**
 * Push Notification Payload
 * Structure for push notification data
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  habitId?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

/**
 * Extended Request with authentication properties
 * Used to attach user information to the request object after authentication
 */
export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Push subscription keys (p256dh and auth) for Web Push
 */
export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

/**
 * Validation input types (inferred from Zod schemas)
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CompletionInput = z.infer<typeof completionSchema>;
export type SkipInput = z.infer<typeof skipSchema>;
