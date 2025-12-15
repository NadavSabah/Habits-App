/**
 * Authentication Service
 * 
 * Handles user registration, login, and user retrieval operations.
 */

import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateToken } from '../utils/jwt.util';
import { AuthResponse, User } from '../types';

/**
 * Register a new user
 * @param email - User's email address
 * @param password - Plain text password (will be hashed)
 * @param name - Optional user's name
 * @returns Authentication response with user data and JWT token
 * @throws Error if user already exists
 */
export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });

  // Generate JWT token
  const token = generateToken(user.id);

  // Return user data (without password) and token
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * test
 * Login an existing user
 * @param email - User's email address
 * @param password - Plain text password to verify
 * @returns Authentication response with user data and JWT token
 * @throws Error if credentials are invalid
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user.id);

  // Return user data (without password) and token
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * Get user by ID
 * @param userId - User's unique identifier
 * @returns User object without password, or null if not found
 */
export const getUserById = async (
  userId: string
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// Export service object with all functions
export const authService = {
  register,
  login,
  getUserById,
};
