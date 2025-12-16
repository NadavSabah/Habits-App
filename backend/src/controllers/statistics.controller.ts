/**
 * Statistics Controller
 * 
 * Handles HTTP requests for statistics endpoints.
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { analyticsService } from '../services/analytics.service';

/**
 * Get statistics for a specific habit
 * @param req - Express request with habit ID in params
 * @param res - Express response object
 */
export const getHabitStatistics = async (
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

    const statistics = await analyticsService.getHabitStatistics(
      req.userId,
      habitId
    );

    if (!statistics) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Habit not found or does not belong to user',
      });
      return;
    }

    res.status(200).json({
      statistics,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Get overall statistics for the authenticated user
 * @param req - Express request
 * @param res - Express response object
 */
export const getUserStatistics = async (
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

    const statistics = await analyticsService.getUserStatistics(req.userId);

    res.status(200).json({
      statistics,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

// Export controller object with all functions
export const statisticsController = {
  getHabitStatistics,
  getUserStatistics,
};
