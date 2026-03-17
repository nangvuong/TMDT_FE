/**
 * Cache Management Utilities for the Application
 * Provides helpers for managing and monitoring cache status
 */

import { cacheManager, generateCategoriesCacheKey } from './cache';

/**
 * Get current cache status for categories
 */
export const getCategoriesCacheStatus = (page: number = 1, limit: number = 6) => {
  const cacheKey = generateCategoriesCacheKey(page, limit);
  const isCached = cacheManager.has(cacheKey);
  
  return {
    isCached,
    key: cacheKey,
    timestamp: isCached ? new Date().toISOString() : null,
  };
};

/**
 * Clear all application cache
 */
export const clearAllCache = () => {
  cacheManager.clearAll();
  console.log('All cache cleared successfully');
};

/**
 * Clear specific categories cache
 */
export const clearCategoriesCache = (page: number = 1, limit: number = 6) => {
  const cacheKey = generateCategoriesCacheKey(page, limit);
  cacheManager.clear(cacheKey);
  console.log(`Cache cleared for categories page ${page}, limit ${limit}`);
};

/**
 * Log cache diagnostics to console (useful for debugging)
 */
export const logCacheDiagnostics = () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    cacheStatus: {
      categoriesP1L6: getCategoriesCacheStatus(1, 6),
      categoriesP1L12: getCategoriesCacheStatus(1, 12),
    },
    note: 'Cache is automatically persisted to localStorage for 5 minutes',
  };
  
  console.log('Cache Diagnostics:', diagnostics);
  return diagnostics;
};

/**
 * Preload categories cache (useful for performance optimization)
 * This can be called on app initialization to warm up the cache
 * Note: Must be called inside a React component
 */
export const preloadCategoriesCacheDocs = () => {
  // This is just a placeholder helper function
  // To actually preload, call useCategories hook inside a component
  console.log('To preload cache, ensure useCategories is called early in app lifecycle');
};
