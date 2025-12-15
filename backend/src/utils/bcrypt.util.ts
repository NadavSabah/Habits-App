/**
 * Bcrypt Utility Functions
 * 
 * Handles password hashing and verification using bcrypt.
 */

import bcrypt from 'bcrypt';

/**
 * Number of salt rounds for bcrypt hashing
 * Higher = more secure but slower (10-12 is recommended)
 */
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hashed password
 * @throws Error if hashing fails
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns A promise that resolves to true if passwords match, false otherwise
 * @throws Error if comparison fails
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
};

