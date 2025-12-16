/**
 * Skip Controller
 * 
 * Handles HTTP requests for habit skip endpoints (CRUD operations).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { skipService } from '../services/skip.service';

/**
 * Create a new skip for a habit
 * @param req - Express request with habit ID in params and skip data in body
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

    const skip = await skipService.createSkip(
      req.userId,
      habitId,
      data
    );

    res.status(201).json({
      message: 'Skip created successfully',
      skip,
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

    if (error.message === 'Skip already exists for this date') {
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
 * Get all skips for a habit
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

    const skips = await skipService.getSkips(
      req.userId,
      habitId,
      startDate as string | undefined,
      endDate as string | undefined
    );

    res.status(200).json({
      skips,
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
 * Delete a skip
 * @param req - Express request with skip ID in params
 * @param res - Express response object
 */
export const deleteSkip = async (
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

    const deleted = await skipService.deleteSkip(req.userId, id);

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Skip not found',
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
export const skipController = {
  create,
  getAll,
  delete: deleteSkip, // 'delete' is a reserved word, so we export it as 'delete'
};
