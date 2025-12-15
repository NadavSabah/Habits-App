/**
 * Completion Controller
 * 
 * Handles HTTP requests for habit completion endpoints (CRUD operations).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { completionService } from '../services/completion.service';

/**
 * Create a new completion for a habit
 * @param req - Express request with habit ID in params and completion data in body
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

    const { habitId } = req.params;
    const data = req.body;

    const completion = await completionService.createCompletion(
      req.userId,
      habitId,
      data
    );

    res.status(201).json({
      message: 'Completion created successfully',
      completion,
    });
  } catch (error: any) {
    // Handle specific errors
    if (error.message === 'Habit not found or does not belong to user') {
      res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }

    if (error.message === 'Completion already exists for this date') {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
      return;
    }

    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Get all completions for a habit
 * @param req - Express request with habit ID in params and optional date range in query
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

    const { habitId } = req.params;
    const { startDate, endDate } = req.query;

    const completions = await completionService.getCompletions(
      req.userId,
      habitId,
      startDate as string | undefined,
      endDate as string | undefined
    );

    res.status(200).json({
      completions,
    });
  } catch (error: any) {
    // Handle specific errors
    if (error.message === 'Habit not found or does not belong to user') {
      res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }

    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Delete a completion
 * @param req - Express request with completion ID in params
 * @param res - Express response object
 */
export const deleteCompletion = async (
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

    const deleted = await completionService.deleteCompletion(req.userId, id);

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Completion not found',
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
export const completionController = {
  create,
  getAll,
  delete: deleteCompletion, // 'delete' is a reserved word, so we export it as 'delete'
};
