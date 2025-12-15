/**
 * Validation Middleware
 * 
 * Validates request body using Zod schemas.
 * Delegates error handling to the error-handler middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  createHabitSchema,
  updateHabitSchema,
  completionSchema,
  skipSchema,
} from '../utils/validation.util';

/**
 * Generic validation middleware factory
 * Creates a middleware function that validates req.body against a Zod schema
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Use safeParse() to avoid throwing - safer approach
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // result.error is guaranteed to be a ZodError instance
      // Pass it to the error-handler middleware
      next(result.error);
      return;
    }

    // Validation passed - replace req.body with validated data
    // This ensures type safety and removes any extra fields
    req.body = result.data;

    // Continue to next middleware/route handler
    next();
  };
};

/**
 * Validation middleware for user registration
 */
export const validateRegister = validate(registerSchema);

/**
 * Validation middleware for user login
 */
export const validateLogin = validate(loginSchema);

/**
 * Validation middleware for creating a habit
 */
export const validateCreateHabit = validate(createHabitSchema);

/**
 * Validation middleware for updating a habit
 */
export const validateUpdateHabit = validate(updateHabitSchema);

/**
 * Validation middleware for marking habit completion
 */
export const validateCompletion = validate(completionSchema);

/**
 * Validation middleware for marking habit skip
 */
export const validateSkip = validate(skipSchema);

