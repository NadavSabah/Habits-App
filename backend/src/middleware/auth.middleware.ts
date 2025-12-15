/**
 * Authentication Middleware
 * 
 * Handles JWT token verification and user authentication for protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { prisma } from '../utils/prisma';

/**
 * Extended Request interface with authentication properties
 * Used to attach user information to the request object after authentication
 */
export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 * 
 * @param req - Express request object (extended with AuthRequest)
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No authorization header provided',
      });
      return;
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Invalid authorization format',
        message: 'Authorization header must start with "Bearer "',
      });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      res.status(401).json({
        error: 'Invalid token',
        message: error instanceof Error ? error.message : 'Token verification failed',
      });
      return;
    }

    // Query database for user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401).json({
        error: 'User not found',
        message: 'User associated with token does not exist',
      });
      return;
    }

    // Attach user information to request object
    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle unexpected errors
    console.error('Authentication middleware error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication',
    });
  }
};

