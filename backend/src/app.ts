/**
 * Express App Setup
 * 
 * Configures and exports the Express application instance
 * with all middleware and routes.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.middleware';
import routes from './routes';

/**
 * Create Express app instance
 */
const app = express();

// Security middleware - should be first
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Error handler middleware - must be last
app.use(errorHandler);

export default app;
