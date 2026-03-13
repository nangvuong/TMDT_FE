import { useState, useCallback, useEffect } from 'react';
import type { AuthResponse } from '../types/user';
import { getToken, setToken, removeToken, subscribeToTokenChange } from '../utils/token';
import authService from '../services/authService';

/**
 * Custom hook for user login
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setToken(response.accessToken);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
};

/**
 * Custom hook for user logout
 */
export const useLogout = () => {
  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem('rememberMe');
  }, []);

  return { logout };
};

/**
 * Custom hook to check if user is logged in - reactive to token changes
 */
export const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = getToken();
    return !!token;
  });

  useEffect(() => {
    // Subscribe to token changes
    const unsubscribe = subscribeToTokenChange((token) => {
      setIsLoggedIn(!!token);
    });

    return unsubscribe;
  }, []);

  return { isLoggedIn };
};
