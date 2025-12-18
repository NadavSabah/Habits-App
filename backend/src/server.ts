/**
 * Server Entry Point
 * 
 * Starts the Express server and handles environment configuration.
 */

import dotenv from 'dotenv';
import app from './app';
import { startCronJobs } from './services/cron.service';

// Load environment variables from .env file
dotenv.config();

// Get PORT from environment variable or default to 3000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start cron jobs for scheduled tasks (e.g., push notifications)
  startCronJobs();
});

// Error handling for server startup
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) { 
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
