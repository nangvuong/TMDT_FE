import axios from 'axios';
import { API_BASE_URL } from '../constants/api'
import { getToken, removeToken } from '../utils/token';
import type { AxiosInstance } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('[AxiosClient Request]', {
      url: config.url,
      tokenExists: !!token,
      tokenLength: token?.length || 0,
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[AxiosClient] ✓ Token attached');
    } else {
      console.warn('[AxiosClient] ⚠ No token - request will likely fail with 401');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error('[AxiosClient Response Error]', {
      status,
      message,
      url: error.config?.url,
      authHeader: error.config?.headers?.Authorization ? 'YES' : 'NO',
    });

    // Handle 401 - Unauthorized (token expired or invalid)
    if (status === 401) {
      console.warn('[AxiosClient] Unauthorized (401) - Removing token');
      removeToken();
      localStorage.removeItem('rememberMe');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
