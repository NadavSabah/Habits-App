/**
 * JWT Utility Functions
 * 
 * Handles JSON Web Token generation and verification for authentication.
 */

import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

/**
 * Generates a JWT token for a user
 * @param userId - The user's unique identifier
 * @returns A signed JWT token string
 * @throws Error if JWT_SECRET is not configured
 */
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Create token payload
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
  };

  // Sign and return token with 7-day expiration
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  });

  return token;
};

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token string to verify
 * @returns The decoded token payload containing userId
 * @throws Error if token is invalid, expired, or JWT_SECRET is not configured
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    throw new Error('Token verification failed');
  }
};

