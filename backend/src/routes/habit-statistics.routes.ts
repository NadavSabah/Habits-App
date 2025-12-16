/**
 * Habit Statistics Routes
 * 
 * Defines habit-specific statistics endpoints.
 */

import { Router } from 'express';
import { statisticsController } from '../controllers/statistics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * GET /:habitId/statistics
 * Get statistics for a specific habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Full path when mounted: /api/habits/:habitId/statistics
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. statisticsController.getHabitStatistics (route handler) - handles the request
 */
router.get('/:habitId/statistics', statisticsController.getHabitStatistics);

export default router;
