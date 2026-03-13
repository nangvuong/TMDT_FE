import { useState, useCallback } from 'react';
import type { PhysicalProfile } from '../types/user';
import userService from '../services/userService';

export const useProfile = () => {
  const [profile, setProfile] = useState<PhysicalProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (err: any) {
      // Include status code in error message for better handling
      const statusCode = err.response?.status || '';
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      const errorMsg = statusCode ? `${message} (${statusCode})` : message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<PhysicalProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userService.updateProfile(data);
      setProfile(updated);
    } catch (err: any) {
      const statusCode = err.response?.status || '';
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      const errorMsg = statusCode ? `${message} (${statusCode})` : message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
