import type { ValidationResult } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;

/**
 * Validate an email address (matches backend register/login rules).
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid email address' };
  }

  return { valid: true };
}

/**
 * Validate a password for registration (min 8, max 100 characters — matches backend).
 */
export function validatePassword(password: string): ValidationResult {
  if (password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must be less than ${PASSWORD_MAX_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate reminder time in HH:mm format (24-hour, matches backend habit schema).
 */
export function validateTimeFormat(time: string): ValidationResult {
  const trimmed = time.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Time is required' };
  }

  if (!TIME_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Time must be in HH:mm format' };
  }

  return { valid: true };
}
