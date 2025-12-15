/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints (register, login, getMe).
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';

/**
 * Register a new user
 * @param req - Express request with email, password, and optional name in body
 * @param res - Express response object
 */
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Call auth service to register user
    const result = await authService.register(email, password, name);

    // Return 201 status with user and token
    res.status(201).json({
      message: 'User registered successfully',
      ...result,
    });
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }
    }

    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Login an existing user
 * @param req - Express request with email and password in body
 * @param res - Express response object
 */
export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Call auth service to login user
    const result = await authService.login(email, password);

    // Return 200 status with user and token
    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }
    }

    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

/**
 * Get current authenticated user
 * @param req - Express request with user attached by auth middleware
 * @param res - Express response object
 */
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // User is already attached to request by auth middleware
    // But we'll fetch fresh data from database to ensure it's up to date
    if (!req.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request',
      });
      return;
    }

    const user = await authService.getUserById(req.userId);

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    // Return 200 status with user data
    res.status(200).json({
      user,
    });
  } catch (error) {
    // Re-throw error to be handled by error handler middleware
    throw error;
  }
};

// Export controller object with all functions
export const authController = {
  register,
  login,
  getMe,
};
