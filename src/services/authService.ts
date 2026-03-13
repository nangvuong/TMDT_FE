import axiosClient from './axiosClient';
import type { 
  User, 
  LoginPayload, 
  RegisterPayload, 
  AuthResponse,
} from '../types/user';
import { AUTH_ENDPOINTS } from '../constants/api';

const authService = {
  register: (data: RegisterPayload) =>
    axiosClient.post<any, AuthResponse>(AUTH_ENDPOINTS.REGISTER, data),

  login: (data: LoginPayload) =>
    axiosClient.post<any, AuthResponse>(AUTH_ENDPOINTS.LOGIN, data),

  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export default authService;
