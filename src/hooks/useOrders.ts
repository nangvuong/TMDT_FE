import { useState, useCallback } from 'react';
import type { Order } from '../types/product';
import orderService from '../services/orderService';

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getMyOrders({ page, limit });
      setOrders(response.data);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.getById(id);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(async (shippingAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.checkout({ shippingAddress });
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout');
      return null;
    } finally {
      setLoading(false);
    }
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
  };
};
