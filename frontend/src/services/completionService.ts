/**
 * Completion Service
 * 
 * Handles all habit completion-related API calls
 */

import api from './api';
import type { HabitCompletion, CreateCompletionDto } from '../types';

/**
 * Create a new completion for a habit
 */
export const create = async (
  habitId: string,
  data: CreateCompletionDto
): Promise<HabitCompletion> => {
  const response = await api.post<HabitCompletion>(
    `/habits/${habitId}/completions`,
    data
  );
  return response.data;
};

/**
 * Get all completions for a habit
 * Optional date range filtering
 */
export const getAll = async (
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitCompletion[]> => {
  // Build query string if dates provided
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate);
  }
  if (endDate) {
    params.append('endDate', endDate);
  }
  
  const queryString = params.toString();
  const url = `/habits/${habitId}/completions${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<HabitCompletion[]>(url);
  return response.data;
};

/**
 * Delete a completion
 */
export const deleteCompletion = async (id: string): Promise<void> => {
  await api.delete(`/habits/completions/${id}`);
};

// Export service object
export const completionService = {
  create,
  getAll,
  delete: deleteCompletion,
};

export default completionService;