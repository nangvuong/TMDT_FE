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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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
