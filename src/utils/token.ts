// Token change listeners subscription
const tokenListeners = new Set<(token: string | null) => void>();

export const subscribeToTokenChange = (callback: (token: string | null) => void): (() => void) => {
  tokenListeners.add(callback);
  return () => tokenListeners.delete(callback);
};

const notifyTokenChange = (token: string | null): void => {
  tokenListeners.forEach(callback => callback(token));
};

/**
 * Cookie utilities for Remember Me functionality
 */
const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const removeCookie = (name: string): void => {
  setCookie(name, '', -1);
};

export const getToken = (): string | null => {
  // Check localStorage first
  const token = localStorage.getItem('accessToken');
  if (token) return token;
  
  // Check cookie (for Remember Me)
  const cookieToken = getCookie('accessToken');
  if (cookieToken) {
    // Restore to localStorage
    localStorage.setItem('accessToken', cookieToken);
    return cookieToken;
  }
  
  // Fallback to old key (authToken)
  return localStorage.getItem('authToken');
};

export const setToken = (token: string, rememberMe: boolean = false): void => {
  localStorage.setItem('accessToken', token);
  
  // If rememberMe is true, also save to cookie (7 days expiry)
  if (rememberMe) {
    setCookie('accessToken', token, 7);
  }
  
  notifyTokenChange(token);
};

export const removeToken = (): void => {
  localStorage.removeItem('accessToken');
  removeCookie('accessToken');
  notifyTokenChange(null);
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  return !!token;
};

export const decodeToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
};
