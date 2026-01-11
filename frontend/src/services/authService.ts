/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 */

import api from './api';
import type { User, AuthResponse } from '../types';

/**
 * Register a new user
 * Saves token and user to localStorage upon successful registration
 */
export const register = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    name,
  });
  
  // Save token and user to localStorage
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};

/**
 * Login an existing user
 * Saves token and user to localStorage upon successful login
 */
export const login = async ( 
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  
  // Save token and user to localStorage
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return response.data;
};

/**
 * Get current authenticated user
 */
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

/**
 * Logout current user
 * Clears token and user from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Export service object
export const authService = {
  register,
  login,
  getMe,
  logout,
};

export default authService;

