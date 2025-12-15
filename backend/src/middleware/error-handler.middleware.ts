/**
 * Error Handling Middleware
 * 
 * Centralized error handling for all routes.
 * Catches errors and returns appropriate HTTP responses.
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logError } from '../utils/logger.util';

/**
 * Error handler middleware
 * Must be the last middleware in the Express app
 * 
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (required for ErrorRequestHandler signature)
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logError('Error occurred in request handler', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        message = 'A record with this value already exists';
        details = {
          field: err.meta?.target,
          code: err.code,
        };
        break;
      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        // Foreign key constraint violation
        message = 'Invalid reference to related record';
        details = {
          field: err.meta?.field_name,
          code: err.code,
        };
        break;
      default:
        message = 'Database operation failed';
        details = {
          code: err.code,
        };
    }
  } 
  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    details = {
      message: err.message,
    };
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = {
      errors: err.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      })),
    };
  }
  // Handle custom errors with statusCode property
  else if (err instanceof Error && 'statusCode' in err) {
    statusCode = (err as any).statusCode || 500;
    message = err.message || 'An error occurred';
  }
  // Handle generic errors
  else if (err instanceof Error) {
    // In development, show full error message
    if (process.env.NODE_ENV === 'development') {
      message = err.message;
      details = {
        stack: err.stack,
      };
    }
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

