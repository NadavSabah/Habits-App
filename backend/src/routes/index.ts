/**
 * Main Routes File
 * 
 * Aggregates all route modules.
 * Routes will be added here as they are created.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import habitRoutes from './habits.routes';
import completionRoutes from './completions.routes';
import skipRoutes from './skips.routes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Habit routes
router.use('/habits', habitRoutes);

// Completion routes (mounted at /habits to match API structure)
router.use('/habits', completionRoutes);

// Skip routes (mounted at /habits to match API structure)
router.use('/habits', skipRoutes);

// Additional routes will be mounted here as they are created
// Example:
// router.use('/statistics', statisticsRoutes);
// router.use('/notifications', notificationRoutes);

export default router;
