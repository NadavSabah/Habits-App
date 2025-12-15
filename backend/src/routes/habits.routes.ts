/**
 * Habit Routes
 * 
 * Defines all habit-related endpoints (CRUD operations).
 */

import { Router } from 'express';
import { habitController } from '../controllers/habit.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateCreateHabit, validateUpdateHabit } from '../middleware/validation.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * GET /
 * Get all habits for the authenticated user
 * - Requires authentication
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. habitController.getAll (route handler) - handles the request
 */
router.get('/', habitController.getAll);

/**
 * GET /:id
 * Get a specific habit by ID
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. habitController.getById (route handler) - handles the request
 */
router.get('/:id', habitController.getById);

/**
 * POST /
 * Create a new habit
 * - Requires authentication
 * - Validates request body
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. validateCreateHabit (middleware) - request validation
 * 3. habitController.create (route handler) - handles the request
 */
router.post(
  '/',
  validateCreateHabit,  // Middleware: validation
  habitController.create  // Route handler: processes request and sends response
);

/**
 * PUT /:id
 * Update an existing habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * - Validates request body
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. validateUpdateHabit (middleware) - request validation
 * 3. habitController.update (route handler) - handles the request
 */
router.put(
  '/:id',
  validateUpdateHabit,  // Middleware: validation
  habitController.update  // Route handler: processes request and sends response
);

/**
 * DELETE /:id
 * Delete a habit
 * - Requires authentication
 * - Habit must belong to the authenticated user
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. habitController.delete (route handler) - handles the request
 */
router.delete('/:id', habitController.delete);

export default router;

