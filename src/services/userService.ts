import axiosClient from './axiosClient';
import type { PhysicalProfile } from '../types/user';
import { PROFILE_ENDPOINTS } from '../constants/api';

const userService = {
  // ====== PROFILE (Authenticated 🔒) ======
  // Get physical profile
  getProfile: () =>
    axiosClient.get<any, PhysicalProfile>(PROFILE_ENDPOINTS.GET),

  // Create/Update physical profile
  updateProfile: (data: Partial<PhysicalProfile>) =>
    axiosClient.put<any, PhysicalProfile>(PROFILE_ENDPOINTS.UPDATE, data),
};

export default userService;
