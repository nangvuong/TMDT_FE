import type { User, PhysicalProfile } from '../types/user';

interface AuthState {
  user: User | null;
  physicalProfile: PhysicalProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

// This is a placeholder for state management
// Consider using Redux, Zustand, or other state management libraries

const initialState: AuthState = {
  user: null,
  physicalProfile: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
};

export const authStore = initialState;

export const setUser = (user: User | null) => {
  authStore.user = user;
  authStore.isAuthenticated = !!user;
};

export const setPhysicalProfile = (profile: PhysicalProfile | null) => {
  authStore.physicalProfile = profile;
};

export const setToken = (token: string | null) => {
  authStore.token = token;
  authStore.isAuthenticated = !!token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const logout = () => {
  authStore.user = null;
  authStore.physicalProfile = null;
  authStore.token = null;
  authStore.isAuthenticated = false;
  localStorage.removeItem('authToken');
};
