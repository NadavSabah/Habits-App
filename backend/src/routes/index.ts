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
import habitStatisticsRoutes from './habit-statistics.routes';
import userStatisticsRoutes from './user-statistics.routes';
import notificationRoutes from './notifications.routes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Habit routes
router.use('/habits', habitRoutes);

// Completion routes (mounted at /habits to match API structure)
router.use('/habits', completionRoutes);

// Skip routes (mounted at /habits to match API structure)
router.use('/habits', skipRoutes);

// Habit statistics routes (mounted at /habits for habit-specific stats)
router.use('/habits', habitStatisticsRoutes);

// User statistics routes (mounted at /statistics for user stats)
router.use('/statistics', userStatisticsRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

export default router;
