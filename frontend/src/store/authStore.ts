/**
 * Authentication Store
 * 
 * Manages authentication state using Zustand
 */

import { create } from 'zustand';
import type { AuthState, User } from '../types';
import { authService } from '../services/authService';

/**
 * Get initial state from localStorage
 */
const getInitialState = (): {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
} => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user: User | null = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
    }
  }

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
};

/**
 * Create authentication store
 */
export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage
  const initialState = getInitialState();

  return {
    // Initial state
    ...initialState,
    loading: false,
    error: null,

    // Login action
    login: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        const { user, token } = await authService.login(email, password);
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Login failed';
        set({
          loading: false,
          error: errorMessage,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        throw error;
      }
    },

    // Register action
    register: async (email: string, password: string, name?: string) => {
      set({ loading: true, error: null });
      try {
        const { user, token } = await authService.register(email, password, name);
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Registration failed';
        set({
          loading: false,
          error: errorMessage,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        throw error;
      }
    },

    // Logout action
    logout: () => {
      authService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    // Check authentication action
    checkAuth: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        const user = await authService.getMe();
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        // Token is invalid, clear it
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    },

    // Clear error action
    clearError: () => {
      set({ error: null });
    },
  };
});
