import { useState, useCallback } from 'react';
import type { Order } from '../types/product';
import orderService, { type CheckoutPayload } from '../services/orderService';
import { cacheManager } from '../utils/cache';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async (page = 1, limit = 10) => {
    const cacheKey = `orders_list_${page}_${limit}`;
    
    // Check cache first
    const cachedData = cacheManager.get<any>(cacheKey);
    if (cachedData) {
      setOrders(cachedData.data);
      setTotal(cachedData.meta.totalItems);
      setCurrentPage(cachedData.meta.page);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getMyOrders({ page, limit });
      setOrders(response.data);
      setTotal(response.meta.totalItems);
      setCurrentPage(response.meta.page);
      
      // Cache the result (15 minutes TTL for orders list)
      cacheManager.set(cacheKey, response, 15 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    const cacheKey = `order_${id}`;
    
    // Check cache first
    const cachedOrder = cacheManager.get<Order>(cacheKey);
    if (cachedOrder) {
      return cachedOrder;
    }

    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getById(id);
      
      // Cache the order (15 minutes TTL)
      cacheManager.set(cacheKey, order, 15 * 60 * 1000);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(async (payload: CheckoutPayload) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.checkout(payload);

      // Clear all orders cache after successful checkout so latest order shows up
      cacheManager.clearAll();

      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const guestCheckout = useCallback(async (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestShippingAddress: string;
    items: { productId: string; quantity: number }[];
    couponCode?: string;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.guestCheckoutApi(data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Guest checkout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrdersCache = useCallback(() => {
    // Clear all order-related cache entries
    cacheManager.clearAll();
  }, []);

  const clearOrderCache = useCallback((id: string) => {
    cacheManager.clear(`order_${id}`);
  }, []);

  return {
    orders,
    total,
    currentPage,
    loading,
    error,
    fetchMyOrders,
    getOrderById,
    checkout,
    guestCheckout,
    clearOrdersCache,
    clearOrderCache,
  };
};
