import { useState, useCallback, useEffect } from 'react';
import wishlistService, { type WishlistItem, type GetWishlistParams } from '../services/wishlistService';
import { useCountersContext } from '../contexts/CountersContext';

/**
 * Hook for managing user's wishlist
 * Handles fetching, adding, removing items from wishlist
 */
export const useWishlist = (initialParams?: GetWishlistParams) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    total: 0,
    totalPage: 0,
  });

  const [params, setParams] = useState<GetWishlistParams>(initialParams || {});
  const { setWishlistCount } = useCountersContext();

  /**
   * Update wishlist count in context
   */
  const updateWishlistCount = useCallback((count: number) => {
    setWishlistCount(count);
  }, [setWishlistCount]);

  /**
   * Fetch wishlist items
   */
  const fetchWishlist = useCallback(async (fetchParams = params) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await wishlistService.getWishlist(fetchParams);
      const wishlistItems = response.data || [];
      // Update context count immediately
      updateWishlistCount(wishlistItems.length);
      setItems(wishlistItems);
      setPagination({
        page: response.pagination.page || 1,
        limit: response.pagination.limit || 10,
        total: response.pagination.total || 0,
        totalPage: response.pagination.totalPage || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
      setItems([]);
      updateWishlistCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [params, updateWishlistCount]);

  /**
   * Initial load: fetch wishlist
   */
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /**
   * Add product to wishlist and refetch
   */
  const addToWishlist = useCallback(async (productId: string) => {
    try {
      setError(null);
      const newItem = await wishlistService.addToWishlist(productId);
      // Refetch wishlist to ensure state is in sync
      await fetchWishlist(params);
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to wishlist';
      setError(errorMessage);
      throw err;
    }
  }, [params]);

  /**
   * Remove product from wishlist and refetch
   */
  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      setError(null);
      await wishlistService.removeFromWishlist(productId);
      // Refetch wishlist to ensure state is in sync
      await fetchWishlist(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      setError(errorMessage);
      throw err;
    }
  }, [params]);

  /**
   * Toggle product in wishlist
   */
  const toggleWishlist = useCallback(
    async (productId: string) => {
      const isInWishlist = wishlistService.isInWishlist(productId, items);
      if (isInWishlist) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistService.isInWishlist(productId, items);
    },
    [items]
  );

  /**
   * Set page for pagination
   */
  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Set limit for pagination
   */
  const setLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  /**
   * Clear wishlist error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh wishlist data
   */
  const refresh = useCallback(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /**
   * Clear all items from wishlist
   */
  const clearWishlist = useCallback(() => {
    updateWishlistCount(0);
    setItems([]);
  }, [updateWishlistCount]);

  /**
   * Get actual wishlist count
   */
  const getWishlistCount = useCallback((): number => {
    return items.length;
  }, [items.length]);

  return {
    // State
    items,
    isLoading,
    error,
    pagination,

    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,

    // Pagination
    setPage,
    setLimit,

    // Utilities
    clearError,
    refresh,
    clearWishlist,
    getWishlistCount,

    // Current params
    currentParams: params,
  };
};

export const useWishlistCount = () => {
  const { wishlistCount } = useCountersContext();
  return wishlistCount;
};

/**
 * Hook for checking if a specific product is in wishlist
 * Lightweight hook for use in product cards, etc.
 */
export const useIsInWishlist = (productId: string, wishlistItems: WishlistItem[]): boolean => {
  return wishlistService.isInWishlist(productId, wishlistItems);
};
