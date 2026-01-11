/**
 * Frontend Type Definitions
 * 
 * This file defines all TypeScript types used in the frontend application.
 * Types are based on the backend Prisma schema and API responses.
 */

/**
 * Habit Category Enu
 * Categories for organizing habits
 */
export type HabitCategory = 'MORNING' | 'EVENING' | 'OTHER';

/**
 * Habit Frequency Enum
 * How often a habit should be performed
 */
export type HabitFrequency = 'DAILY' | 'WEEKLY';

/**
 * User Interface
 * Represents a user in the application
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Habit Interface
 * Represents a habit that a user wants to track
 */
export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  timesPerWeek?: number; // if weekly, how many times (1-7)
  timesPerDay?: number; // if daily, how many times (default: 1)
  timesPerMonth?: number; // if monthly, how many times (default: 1)
  reminderTime?: string; // HH:mm format (e.g., "07:00" for morning)
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Habit Completion Interface
 * Represents a completed habit entry for a specific date
 */
export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  duration?: number; // duration in minutes
  notes?: string;
  completedAt?: string; // ISO date string
}

/**
 * Habit Skip Interface
 * Represents a skipped habit entry for a specific date
 */
export interface HabitSkip {
  id: string;
  habitId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  reason?: string;
  skippedAt?: string; // ISO date string
}

/**
 * Habit Statistics Interface
 * Calculated statistics for a specific habit
 */
export interface HabitStatistics {
  totalCompletions: number;
  totalSkips: number;
  totalTime: number; // in minutes
  completionRate: number; // percentage (0-100)
  currentStreak: number; // consecutive days
  longestStreak: number; // consecutive days
}

/**
 * User Statistics Interface
 * Overall statistics for a user across all habits
 */
export interface UserStatistics {
  totalHabits: number;
  totalCompletions: number;
  totalSkips: number;
  totalTime: number; // in minutes
  averageCompletionRate: number; // percentage (0-100)
}

/**
 * Create Habit DTO
 * Data structure for creating a new habit
 * Excludes id and timestamps (auto-generated)
 */
export interface CreateHabitDto {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  timesPerWeek?: number;
  timesPerDay?: number;
  timesPerMonth?: number;
  reminderTime?: string; // HH:mm format
}

/**
 * Update Habit DTO
 * Data structure for updating an existing habit
 * All fields are optional (Partial of CreateHabitDto)
 */
export type UpdateHabitDto = Partial<CreateHabitDto>;

/**
 * Create Completion DTO
 * Data structure for creating a habit completion
 */
export interface CreateCompletionDto {
  date: string; // ISO date string (YYYY-MM-DD)
  duration?: number; // in minutes
  notes?: string;
}

/**
 * Create Skip DTO
 * Data structure for creating a habit skip
 */
export interface CreateSkipDto {
  date: string; // ISO date string (YYYY-MM-DD)
  reason?: string;
}

/**
 * Authentication Response
 * Returned after successful login or registration
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * API Error Response
 * Standard error response structure from the API
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * VAPID Key Response
 * Response from the server containing the public VAPID key for push notifications
 */
export interface VapidKeyResponse {
  publicKey: string;
}

/**
 * Subscription Keys
 * Encryption keys for push notification subscription
 */
export interface SubscriptionKeys {
  p256dh: string;
  auth: string;
}

/**
 * Push Subscription DTO
 * Data structure for subscribing to push notifications
 */
export interface PushSubscriptionDto {
  endpoint: string;
  keys: SubscriptionKeys;
  habitId?: string;
}

/**
 * Push Unsubscribe DTO
 * Data structure for unsubscribing from push notifications
 */
export interface PushUnsubscribeDto {
  endpoint: string;
}


