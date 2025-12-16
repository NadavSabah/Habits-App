/**
 * Skip Routes
 * 
 * Defines all habit skip-related endpoints (CRUD operations).
 */

import { Router } from 'express';
import { skipController } from '../controllers/skip.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateSkip } from '../middleware/validation.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * POST /:habitId/skips
 * Create a new skip for a habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Validates request body
 * - Full path when mounted: /api/habits/:habitId/skips
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. validateSkip (middleware) - request validation
 * 3. skipController.create (route handler) - handles the request
 */
router.post(
  '/:habitId/skips',
  validateSkip,  // Middleware: validation
  skipController.create  // Route handler: processes request and sends response
);

/**
 * GET /:habitId/skips
 * Get all skips for a habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Optional query params: startDate, endDate (YYYY-MM-DD format)
 * - Full path when mounted: /api/habits/:habitId/skips
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. skipController.getAll (route handler) - handles the request
 */
router.get('/:habitId/skips', skipController.getAll);

/**
 * DELETE /skips/:id
 * Delete a skip
 * - Requires authentication
 * - Skip must belong to a habit owned by the authenticated user
 * - Full path when mounted: /api/habits/skips/:id
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. skipController.delete (route handler) - handles the request
 */
router.delete('/skips/:id', skipController.delete);

export default router;
