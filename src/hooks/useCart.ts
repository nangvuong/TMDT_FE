import { useState, useCallback } from 'react';
import type { Cart, CartItem } from '../types/product';
import cartService from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const item = await cartService.addToCart({ productId, quantity });
        if (cart) {
          const existingItem = cart.items?.find((i) => i.productId === productId);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.items = [...(cart.items || []), item];
          }
          setCart({ ...cart });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add item');
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setLoading(true);
      setError(null);
      try {
        await cartService.removeFromCart(itemId);
        if (cart) {
          cart.items = cart.items?.filter((i) => i.id !== itemId);
          setCart({ ...cart });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item');
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    removeItem,
    clearCart,
  };
};
