/**
 * Skip Service
 * 
 * Handles all habit skip-related API calls
 */

import api from './api';
import type { HabitSkip, CreateSkipDto } from '../types';

/**
 * Create a new skip for a habit
 */
export const create = async (
  habitId: string,
  data: CreateSkipDto
): Promise<HabitSkip> => {
  const response = await api.post<HabitSkip>(
    `/habits/${habitId}/skips`,
    data
  );
  return response.data;
};

/**
 * Get all skips for a habit
 * Optional date range filtering
 */
export const getAll = async (
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitSkip[]> => {
  // Build query string if dates provided
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }
  
  const queryString = params.toString();
  const url = `/habits/${habitId}/skips${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<HabitSkip[]>(url);
  return response.data;
};

/**
 * Delete a skip
 */
export const deleteSkip = async (id: string): Promise<void> => {
  await api.delete(`/habits/skips/${id}`);
};

// Export service object
export const skipService = {
  create,
  getAll,
  delete: deleteSkip,
};

export default skipService;