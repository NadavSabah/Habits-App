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

/**
 * Auth State Interface
 * Defines the shape of the authentication store
 * Includes both state properties and action methods (standard Zustand pattern)
 */
export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Habit State Interface
 * Defines the shape of the habit store
 */
export interface HabitState {
  // State
  habits: Habit[];
  selectedHabit: Habit | null;
  completions: Record<string, HabitCompletion[]>; // key: habitId, value: completions array
  skips: Record<string, HabitSkip[]>; // key: habitId, value: skips array
  statistics: Record<string, HabitStatistics>; // key: habitId, value: statistics
  loading: boolean;
  error: string | null;

  // Actions
  fetchHabits: () => Promise<void>;
  fetchHabitById: (id: string) => Promise<void>;
  createHabit: (data: CreateHabitDto) => Promise<Habit>;
  updateHabit: (id: string, data: UpdateHabitDto) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  fetchCompletions: (habitId: string, startDate?: string, endDate?: string) => Promise<void>;
  fetchSkips: (habitId: string, startDate?: string, endDate?: string) => Promise<void>;
  markComplete: (habitId: string, data: CreateCompletionDto) => Promise<HabitCompletion>;
  markSkipped: (habitId: string, data: CreateSkipDto) => Promise<HabitSkip>;
  removeCompletion: (habitId: string, date: string) => Promise<void>;
  removeSkip: (habitId: string, date: string) => Promise<void>;
  fetchStatistics: (habitId: string) => Promise<void>;
  filterByCategory: (category: HabitCategory | null) => Habit[];
  setSelectedHabit: (habit: Habit | null) => void;
  clearError: () => void;
}

/**
 * Button component props
 * Variants match Design/README.md: primary (indigo), secondary (gray), success (green "Mark Done"), danger (red).
 */
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  className?: string;
}

/**
 * Input component props.
 * Extends HTML input attributes; optional label and error for Design/README.md (label above, helper/error below).
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Modal component props.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Loading spinner component props.
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Protected route component props.
 * Wraps content that requires authentication; redirects to login if not authenticated.
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Habit card component props.
 */
export interface HabitCardProps {
  habit: Habit;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  /** When provided, shows completed (✓) or not (○) for today. */
  completedToday?: boolean;
}

/**
 * Habit list component props.
 */
export interface HabitListProps {
  /** When provided, filters habits by category. */
  selectedCategory?: HabitCategory | null;
  onHabitClick?: (habit: Habit) => void;
  onHabitEdit?: (habit: Habit) => void;
  onHabitDelete?: (habit: Habit) => void;
}

/**
 * Habit form component props (create or edit).
 */
export interface HabitFormProps {
  /** When provided, form is in edit mode and loads this habit. */
  habitId?: string;
  /** Called when form is submitted successfully or user cancels. */
  onClose: () => void;
}

/**
 * Habit category filter component props.
 */
export interface HabitCategoryFilterProps {
  /** Currently selected category; null means "All". */
  selectedCategory: HabitCategory | null;
  /** Called when the user selects a category. */
  onCategoryChange: (category: HabitCategory | null) => void;
}

/**
 * Habit detail component props.
 */
export interface HabitDetailProps {
  /** The habit to display. */
  habit: Habit;
  /** When true, calendar inside won't fetch completions/skips (e.g. for mock habits). */
  disableCalendarFetch?: boolean;
}

/**
 * Habit calendar component props (Phase 16).
 */
export interface HabitCalendarProps {
  habit: Habit;
  /** When true, skips fetching completions/skips (e.g. for mock habits on a showcase). */
  disableFetch?: boolean;
}

/**
 * Statistics panel component props (Phase 17).
 */
export interface StatisticsPanelProps {
  habitId: string;
}

/**
 * Calendar day status for completion/skip display.
 */
export type CalendarDayStatus = 'completed' | 'skipped' | 'pending';

/**
 * Calendar day component props (Phase 16).
 */
export interface CalendarDayProps {
  date: Date;
  status: CalendarDayStatus;
  onClick: () => void;
  /** Whether this day is today. */
  isToday?: boolean;
  /** Whether this day is in the currently displayed month. */
  isCurrentMonth?: boolean;
}
