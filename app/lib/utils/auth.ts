// Auth utility functions

import Cookies from 'js-cookie';

/**
 * Set authentication token in cookie
 */
export const setToken = (token: string): void => {
  // Lưu token vào cookie với thời hạn 7 ngày
  Cookies.set('token', token, { expires: 7 });
};

/**
 * Get authentication token from cookie
 */
export const getToken = (): string | null => {
  return Cookies.get('token') || null;
};

/**
 * Remove authentication token from cookie
 */
export const removeToken = (): void => {
  Cookies.remove('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = Cookies.get('token');
  return !!token;
};
