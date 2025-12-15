/**
 * Main Routes File
 * 
 * Aggregates all route modules.
 * Routes will be added here as they are created.
 */

import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Additional routes will be mounted here as they are created
// Example:
// router.use('/habits', habitRoutes);

export default router;
