/**
 * Completion Routes
 * 
 * Defines all habit completion-related endpoints (CRUD operations).
 */

import { Router } from 'express';
import { completionController } from '../controllers/completion.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateCompletion } from '../middleware/validation.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * POST /:habitId/completions
 * Create a new completion for a habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Validates request body
 * - Full path when mounted: /api/habits/:habitId/completions
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. validateCompletion (middleware) - request validation
 * 3. completionController.create (route handler) - handles the request
 */
router.post(
  '/:habitId/completions',
  validateCompletion,  // Middleware: validation
  completionController.create  // Route handler: processes request and sends response
);

/**
 * GET /:habitId/completions
 * Get all completions for a habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Optional query params: startDate, endDate (YYYY-MM-DD format)
 * - Full path when mounted: /api/habits/:habitId/completions
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. completionController.getAll (route handler) - handles the request
 */
router.get('/:habitId/completions', completionController.getAll);

/**
 * DELETE /completions/:id
 * Delete a completion
 * - Requires authentication
 * - Completion must belong to a habit owned by the authenticated user
 * - Full path when mounted: /api/habits/completions/:id
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. completionController.delete (route handler) - handles the request
 */
router.delete('/completions/:id', completionController.delete);

export default router;
