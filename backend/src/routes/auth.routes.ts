/**
 * Authentication Routes
 * 
 * Defines all authentication-related endpoints.
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

/**
 * POST /register
 * Register a new user
 * - Rate limited to prevent abuse
 * - Validates request body
 * 
 * Middleware chain:
 * 1. authLimiter (middleware) - rate limiting
 * 2. validateRegister (middleware) - request validation
 * 3. authController.register (route handler) - handles the request
 */
router.post(
  '/register',
  authLimiter,        // Middleware: rate limiting
  validateRegister,   // Middleware: validation
  authController.register  // Route handler: processes request and sends response
);

/**
 * POST /login
 * Login an existing user
 * - Rate limited to prevent brute force attacks
 * - Validates request body
 * 
 * Middleware chain:
 * 1. authLimiter (middleware) - rate limiting
 * 2. validateLogin (middleware) - request validation
 * 3. authController.login (route handler) - handles the request
 */
router.post(
  '/login',
  authLimiter,        // Middleware: rate limiting
  validateLogin,      // Middleware: validation
  authController.login  // Route handler: processes request and sends response
);

/**
 * GET /me
 * Get current authenticated user
 * - Requires authentication
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication
 * 2. authController.getMe (route handler) - handles the request
 */
router.get(
  '/me',
  authenticate,         // Middleware: authentication
  authController.getMe  // Route handler: processes request and sends response
);

export default router;
