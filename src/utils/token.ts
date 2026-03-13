// Token change listeners subscription
const tokenListeners = new Set<(token: string | null) => void>();

export const subscribeToTokenChange = (callback: (token: string | null) => void): (() => void) => {
  tokenListeners.add(callback);
  return () => tokenListeners.delete(callback);
};

const notifyTokenChange = (token: string | null): void => {
  tokenListeners.forEach(callback => callback(token));
};

export const getToken = (): string | null => {
  // Check new key first, fallback to old key for migration
  const token = localStorage.getItem('accessToken');
  if (token) return token;
  
  // Fallback to old key (authToken)
  return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
  notifyTokenChange(token);
};

export const removeToken = (): void => {
  localStorage.removeItem('accessToken');
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
