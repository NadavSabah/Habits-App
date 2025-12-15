/**
 * Habit Controller
 * 
 * Handles HTTP requests for habit endpoints (CRUD operations).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { habitService } from '../services/habit.service';

/**
 * Get all habits for the authenticated user
 * @param req - Express request with authenticated user
 * @param res - Express response object
 */
export const getAll = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const habits = await habitService.getUserHabits(req.userId);

    res.status(200).json({
      habits,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Get a specific habit by ID
 * @param req - Express request with habit ID in params
 * @param res - Express response object
 */
export const getById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const { id } = req.params;

    const habit = await habitService.getHabitById(req.userId, id);

    if (!habit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Habit not found',
      });
      return;
    }

    res.status(200).json({
      habit,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Create a new habit
 * @param req - Express request with habit data in body
 * @param res - Express response object
 */
export const create = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const data = req.body;

    const habit = await habitService.createHabit(req.userId, data);

    res.status(201).json({
      message: 'Habit created successfully',
      habit,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Update an existing habit
 * @param req - Express request with habit ID in params and update data in body
 * @param res - Express response object
 */
export const update = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const { id } = req.params;
    const data = req.body;

    const habit = await habitService.updateHabit(req.userId, id, data);

    if (!habit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Habit not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Habit updated successfully',
      habit,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Delete a habit
 * @param req - Express request with habit ID in params
 * @param res - Express response object
 */
export const deleteHabit = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const { id } = req.params;

    const deleted = await habitService.deleteHabit(req.userId, id);

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Habit not found',
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

// Export controller object with all functions
export const habitController = {
  getAll,
  getById,
  create,
  update,
  delete: deleteHabit, // 'delete' is a reserved word, so we export it as 'delete'
};
