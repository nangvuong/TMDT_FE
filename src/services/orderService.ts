import axiosClient from './axiosClient';
import type { Order } from '../types/product';
import { ORDERS_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

export interface CheckoutPayload {
  shippingAddress: string;
}

export interface GetOrdersParams {
  /**
   * Page number for pagination
   * @example 1
   * @default 1
   */
  page?: number;

  /**
   * Number of items per page
   * @example 10
   * @default 10
   * @max 100
   */
  limit?: number;

  /**
   * Filter orders by status
   * @example "DELIVERED"
   * @optional
   */
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  /**
   * Sort field: 'totalAmount', 'status', 'createdAt'
   * @example "totalAmount"
   * @default "createdAt"
   * @optional
   */
  sortBy?: 'totalAmount' | 'status' | 'createdAt';

  /**
   * Sort order: 'asc' (ascending) or 'desc' (descending)
   * @example "desc"
   * @default "desc"
   * @optional
   */
  order?: 'asc' | 'desc';

  /**
   * Filter by minimum order amount (VND)
   * @example 500000
   * @optional
   */
  minAmount?: number;

  /**
   * Filter by maximum order amount (VND)
   * @example 5000000
   * @optional
   */
  maxAmount?: number;

  /**
   * Filter by date range - start date (ISO format)
   * @example "2026-03-01T00:00:00Z"
   * @optional
   */
  fromDate?: string;

  /**
   * Filter by date range - end date (ISO format)
   * @example "2026-03-14T23:59:59Z"
   * @optional
   */
  toDate?: string;

  /**
   * Search by shipping address
   * @example "Quận 1"
   * @optional
   */
  searchAddress?: string;

  /**
   * Filter by user ID (Admin only)
   * @example "550e8400-e29b-41d4-a716-446655440001"
   * @optional
   */
  userId?: string;
}

const orderService = {
  // Checkout from cart (Authenticated 🔒)
  checkout: (data: CheckoutPayload) =>
    axiosClient.post<any, Order>(ORDERS_ENDPOINTS.CHECKOUT, data),

  // Get user's orders (Authenticated 🔒)
  getMyOrders: (params?: GetOrdersParams) =>
    axiosClient.get<any, { data: Order[]; total: number; page: number; limit: number }>(
      ORDERS_ENDPOINTS.GET_MY_ORDERS,
      { params: {
        [QUERY_PARAMS.PAGE]: params?.page || DEFAULT_PAGINATION.PAGE,
        [QUERY_PARAMS.LIMIT]: params?.limit || DEFAULT_PAGINATION.LIMIT,
        ...(params?.status && { status: params.status }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.order && { order: params.order }),
        ...(params?.minAmount !== undefined && { minAmount: params.minAmount }),
        ...(params?.maxAmount !== undefined && { maxAmount: params.maxAmount }),
        ...(params?.fromDate && { fromDate: params.fromDate }),
        ...(params?.toDate && { toDate: params.toDate }),
        ...(params?.searchAddress && { searchAddress: params.searchAddress }),
        ...(params?.userId && { userId: params.userId }),
      }}
    ),

  // Get order by ID (Authenticated 🔒)
  getById: (id: string) =>
    axiosClient.get<any, Order>(ORDERS_ENDPOINTS.GET_BY_ID.replace(':id', id)),
};

export default orderService;
