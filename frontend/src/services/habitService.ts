/**
 * Habit Service
 * 
 * Handles all habit-related API calls
 */

import api from './api';
import type { Habit, CreateHabitDto, UpdateHabitDto } from '../types';

/**
 * Get all habits for the authenticated user
 */
export const getAll = async (): Promise<Habit[]> => {
  const response = await api.get<Habit[]>('/habits');
  return response.data;
};

/**
 * Get a specific habit by ID
 */
export const getById = async (id: string): Promise<Habit> => {
  const response = await api.get<Habit>(`/habits/${id}`);
  return response.data;
};

/**
 * Create a new habit
 */
export const create = async (data: CreateHabitDto): Promise<Habit> => {
  const response = await api.post<Habit>('/habits', data);
  return response.data;
};

/**
 * Update an existing habit
 */
export const update = async (
  id: string,
  data: UpdateHabitDto
): Promise<Habit> => {
  const response = await api.put<Habit>(`/habits/${id}`, data);
  return response.data;
};

/**
 * Delete a habit
 */
export const deleteHabit = async (id: string): Promise<void> => {
  await api.delete(`/habits/${id}`);
};

// Export service object
export const habitService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteHabit,
};

export default habitService;

