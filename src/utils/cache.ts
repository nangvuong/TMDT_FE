/**
 * Cache utility for storing and retrieving data with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private listeners: Map<string, Set<(value: any) => void>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Set a value in cache
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    // Disabled localStorage caching to prevent stale data across reloads
    // Notify all listeners for this key
    this.notifyListeners(key, data);
  }

  /**
   * Subscribe to cache changes
   */
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Notify all listeners of cache change
   */
  private notifyListeners(key: string, value: any): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value);
        } catch (e) {
          console.error('Error in cache listener callback:', e);
        }
      });
    }
  }

  /**
   * Get a value from cache if it's still valid
   */
  get<T>(key: string): T | null {
    // Try memory cache first
    const entry = this.cache.get(key);
    if (entry) {
      const isValid = Date.now() - entry.timestamp < entry.ttl;
      if (isValid) {
        return entry.data as T;
      } else {
        // Entry expired, remove it
        this.cache.delete(key);
      }
    }

    // Try localStorage as fallback (Disabled)
    return null;
  }

  /**
   * Check if cache key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific cache key
   */
  clear(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Failed to clear cache from localStorage:', e);
    }
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
    try {
      // Clear all cache entries from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear all cache from localStorage:', e);
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

/**
 * Generate a cache key for categories with specific params
 */
export const generateCategoriesCacheKey = (page: number, limit: number): string => {
  return `categories_p${page}_l${limit}`;
};
