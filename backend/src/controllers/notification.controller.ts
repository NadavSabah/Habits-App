/**
 * Notification Controller
 * 
 * Handles HTTP requests for push notification endpoints (subscribe, unsubscribe, get VAPID key).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { habitService } from '../services/habit.service';
import { pushNotificationService } from '../services/push-notification.service';

/**
 * Get public VAPID key for client-side subscription
 * @param req - Express request object
 * @param res - Express response object
 */
export const getVapidKey = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
      res.status(500).json({
        error: 'Server Error',
        message: 'VAPID public key not configured',
      });
      return;
    }

    // Return public VAPID key
    res.status(200).json({
      publicKey,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Subscribe to push notifications
 * @param req - Express request with subscription data and optional habitId in body
 * @param res - Express response object
 */
export const subscribe = async (
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

    // Extract subscription data from request body
    const { endpoint, keys, habitId } = req.body;

    // Validate required fields
    if (!endpoint || !keys) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: endpoint and keys',
      });
      return;
    }

    // Validate keys structure
    if (!keys.p256dh || !keys.auth) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid keys structure. Must include p256dh and auth',
      });
      return;
    }

    // If habitId is provided, verify it belongs to the user using habit service
    if (habitId) {
      const habit = await habitService.getHabitById(req.userId, habitId);
      
      if (!habit) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Habit not found or does not belong to user',
        });
        return;
      }
    }

    // Use service to create or update subscription
    const result = await pushNotificationService.createOrUpdateSubscription(
      req.userId,
      endpoint,
      keys,
      habitId
    );

    // Return appropriate status based on whether it was an update or create
    res.status(result.isUpdate ? 200 : 201).json({
      message: result.isUpdate 
        ? 'Subscription updated successfully' 
        : 'Subscription created successfully',
    });
  } catch (error) {
    // Handle service errors
    if (error instanceof Error) {
      if (error.message === 'Endpoint already subscribed by another user') {
        res.status(409).json({
          error: 'Conflict',
          message: error.message,
        });
        return;
      }
    }
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 * @param req - Express request with endpoint in body
 * @param res - Express response object
 */
export const unsubscribe = async (
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

    // Extract endpoint from request body
    const { endpoint } = req.body;

    if (!endpoint) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: endpoint',
      });
      return;
    }

    // Use service to delete subscription
    const deleted = await pushNotificationService.deleteSubscription(
      req.userId,
      endpoint
    );

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Subscription not found',
      });
      return;
    }

    // Return 204 status (no content)
    res.status(204).send();
  } catch (error) {
    // Handle service errors
    if (error instanceof Error) {
      if (error.message === 'Subscription does not belong to user') {
        res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        });
        return;
      }
    }
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

// Export controller object with all functions
export const notificationController = {
  getVapidKey,
  subscribe,
  unsubscribe,
};
