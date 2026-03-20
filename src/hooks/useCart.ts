import { useState, useCallback, useEffect } from 'react';
import type { Cart } from '../types/product';
import cartService, { type AddToCartPayload } from '../services/cartService';
import { useIsLoggedIn } from './useAuth';
import { useCountersContext } from '../contexts/CountersContext';
import { cacheManager } from '../utils/cache';

export const useCart = () => {
  const { isLoggedIn } = useIsLoggedIn();
  const { setCartCount } = useCountersContext();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get total items in cart
   */
  const getCartCount = useCallback((): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  /**
   * Update context whenever cart changes
   */
  useEffect(() => {
    const count = getCartCount();
    setCartCount(count);
  }, [cart, setCartCount]);

  /**
   * Fetch user's cart (GET /cart) with caching
   */
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Try to get from cache first
      const cachedCart = cacheManager.get<Cart>('cart');
      if (cachedCart) {
        setCart(cachedCart);
        setIsLoading(false);
        return;
      }

      // If no cache, fetch from API
      const data = await cartService.getCart();
      setCart(data);
      // Cache the result for 5 minutes
      cacheManager.set('cart', data, 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  /**
   * Auto-fetch cart on mount when logged in
   */
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  /**
   * Add product to cart (POST /cart/items)
   */
  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      if (!isLoggedIn) {
        setError('Please log in to add items to cart');
        throw new Error('User not logged in');
      }

      setError(null);
      try {
        const newItem = await cartService.addToCart(payload);
        
        // Update cart state with new item
        if (cart && cart.items) {
          const existingItemIndex = cart.items.findIndex(
            (i) => i.productId === payload.productId
          );
          
          if (existingItemIndex !== -1) {
            // Update quantity if item already exists
            cart.items[existingItemIndex].quantity += payload.quantity;
          } else {
            // Add new item
            cart.items.push(newItem);
          }
          
          // Update cart totals (these should come from the backend)
          const updatedCart = { ...cart };
          setCart(updatedCart);
          // Invalidate and re-cache with new cart data
          cacheManager.clear('cart');
          cacheManager.set('cart', updatedCart, 5 * 60 * 1000);
        }
        
        return newItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
        setError(errorMessage);
        throw err;
      }
    },
    [isLoggedIn, cart]
  );

  /**
   * Add to cart with separate parameters (convenience method)
   */
  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      return addToCart({ productId, quantity });
    },
    [addToCart]
  );

  /**
   * Remove item from cart (DELETE /cart/items/:itemId)
   */
  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!isLoggedIn) {
        setError('Please log in to remove items from cart');
        throw new Error('User not logged in');
      }

      setError(null);
      try {
        await cartService.removeFromCart(itemId);
        
        // Update local cart state
        if (cart && cart.items) {
          const updatedCart = {
            ...cart,
            items: cart.items.filter((item) => item.id !== itemId),
          };
          setCart(updatedCart);
          // Invalidate and re-cache with new cart data
          cacheManager.clear('cart');
          cacheManager.set('cart', updatedCart, 5 * 60 * 1000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
        setError(errorMessage);
        throw err;
      }
    },
    [isLoggedIn, cart]
  );

  /**
   * Remove item from cart (alias for removeFromCart)
   */
  const removeItem = useCallback(
    (itemId: string) => removeFromCart(itemId),
    [removeFromCart]
  );

  /**
   * Clear entire cart (DELETE /cart)
   */
  const clearCart = useCallback(async () => {
    if (!isLoggedIn) {
      setError('Please log in to clear cart');
      throw new Error('User not logged in');
    }

    setError(null);
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    }
  }, [isLoggedIn]);

  /**
   * Get total price in cart
   */
  const getTotalPrice = useCallback((): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = typeof item.product?.price === 'string' 
        ? parseFloat(item.product.price) 
        : (item.product?.price || 0);
      return total + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  /**
   * Clear cart error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    cart,
    isLoading,
    error,

    // Cart actions
    fetchCart,
    addToCart,
    addItem,
    removeFromCart,
    removeItem,
    clearCart,

    // Getters
    cartCount: getCartCount(),
    totalPrice: getTotalPrice(),
    cartItems: cart?.items || [],
    isEmpty: !cart || !cart.items || cart.items.length === 0,

    // Utilities
    clearError,
  };
};

/**
 * Hook to get cart count from context
 * Lightweight hook for displaying cart count in Header
 */
export const useCartCount = () => {
  const { cartCount } = useCountersContext();
  return cartCount;
};
