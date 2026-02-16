import api from './api';
import type { HabitStatistics, UserStatistics } from '../types';

/**
 * Statistics Service
 * Handles API calls for habit and user statistics
 */

/**
 * Get statistics for a specific habit
 * @param habitId - The ID of the habit
 * @returns Promise resolving to habit statistics
 */
export const getHabitStatistics = async (habitId: string): Promise<HabitStatistics> => {
  const response = await api.get<{ statistics: HabitStatistics }>(`/habits/${habitId}/statistics`);
  return response.data.statistics;
};

/**
 * Get overall statistics for the current user across all habits
 * @returns Promise resolving to user statistics
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await api.get<{ statistics: UserStatistics }>('/statistics');
  return response.data.statistics;
};

const statisticsService = {
  getHabitStatistics,
  getUserStatistics,
};

export default statisticsService;
