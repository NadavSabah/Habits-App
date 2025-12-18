/**
 * Notification Routes
 * 
 * Defines all push notification-related endpoints.
 */

import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * GET /vapid-key
 * Get public VAPID key for client-side push notification subscription
 * - Requires authentication
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. notificationController.getVapidKey (route handler) - handles the request
 */
router.get('/vapid-key', notificationController.getVapidKey);

/**
 * POST /subscribe
 * Subscribe to push notifications
 * - Requires authentication
 * - Accepts subscription data (endpoint, keys) and optional habitId
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. notificationController.subscribe (route handler) - handles the request
 */
router.post('/subscribe', notificationController.subscribe);

/**
 * POST /unsubscribe
 * Unsubscribe from push notifications
 * - Requires authentication
 * - Accepts endpoint in request body
 * 
 * Middleware chain:
 * 1. authenticate (middleware) - JWT authentication (applied to all routes)
 * 2. notificationController.unsubscribe (route handler) - handles the request
 */
router.post('/unsubscribe', notificationController.unsubscribe);

export default router;
