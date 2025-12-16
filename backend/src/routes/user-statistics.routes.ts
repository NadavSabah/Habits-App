/**
 * User Statistics Routes
 * 
 * Defines user-level statistics endpoints.
 */

import { Router } from 'express';
import { statisticsController } from '../controllers/statistics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * GET /
 * Get overall statistics for the authenticated user
 * - Requires authentication
 * - Full path when mounted: /api/statistics
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. statisticsController.getUserStatistics (route handler) - handles the request
 */
router.get('/', statisticsController.getUserStatistics);

export default router;
