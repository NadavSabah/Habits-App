/**
 * Main Routes File
 * 
 * Aggregates all route modules and mounts them under their respective paths.
 * All routes are prefixed with /api when mounted in app.ts
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
// Full path: /api/auth/*
router.use('/auth', authRoutes);

// Habit routes
// Full path: /api/habits/*
router.use('/habits', habitRoutes);

// Completion routes (mounted at /habits to match API structure)
// Full path: /api/habits/:habitId/completions, /api/habits/completions/:id
router.use('/habits', completionRoutes);

// Skip routes (mounted at /habits to match API structure)
// Full path: /api/habits/:habitId/skips, /api/habits/skips/:id
router.use('/habits', skipRoutes);

// Habit statistics routes (mounted at /habits for habit-specific stats)
// Full path: /api/habits/:habitId/statistics
router.use('/habits', habitStatisticsRoutes);

// User statistics routes (mounted at /statistics for user stats)
// Full path: /api/statistics
router.use('/statistics', userStatisticsRoutes);

// Notification routes
// Full path: /api/notifications/*
router.use('/notifications', notificationRoutes);

export default router;
