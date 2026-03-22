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
 * Get addresses cache status
 */
export const getAddressesCacheStatus = () => {
  const itemsCached = cacheManager.has('addresses_all');
  
  return {
    itemsCached,
    timestamp: itemsCached ? new Date().toISOString() : null,
  };
};

/**
 * Get single address cache status
 */
export const getAddressCacheStatus = (id: string) => {
  const cacheKey = `address_${id}`;
  const isCached = cacheManager.has(cacheKey);
  
  return {
    isCached,
    key: cacheKey,
    timestamp: isCached ? new Date().toISOString() : null,
  };
};

/**
 * Get wishlist cache status
 */
export const getWishlistCacheStatus = () => {
  const itemsCached = cacheManager.has('wishlist_items');
  const countCached = cacheManager.has('wishlist_count');
  
  return {
    itemsCached,
    countCached,
    timestamp: itemsCached ? new Date().toISOString() : null,
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
 * Clear all addresses cache
 */
export const clearAddressesCache = () => {
  cacheManager.clear('addresses_all');
  console.log('All addresses cache cleared');
};

/**
 * Clear specific address cache by ID
 */
export const clearAddressCache = (id: string) => {
  const cacheKey = `address_${id}`;
  cacheManager.clear(cacheKey);
  console.log(`Address cache cleared for ID: ${id}`);
};

/**
 * Clear all address-related cache (all addresses + all individual addresses)
 */
export const clearAllAddressesCache = () => {
  cacheManager.clear('addresses_all');
  // Also clear any individual address cache entries
  // This is handled by the service layer
  console.log('All address-related cache cleared');
};

/**
 * Clear wishlist cache
 */
export const clearWishlistCache = () => {
  cacheManager.clear('wishlist_items');
  cacheManager.clear('wishlist_count');
  console.log('Wishlist cache cleared');
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
      addresses: getAddressesCacheStatus(),
      wishlist: getWishlistCacheStatus(),
    },
    note: 'Cache is automatically persisted to localStorage for 5 minutes (categories/addresses) or 30 minutes (wishlist)',
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
