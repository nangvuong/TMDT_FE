import axiosClient from './axiosClient';
import type { Order } from '../types/product';
import { ORDERS_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

export interface CheckoutPayload {
  shippingAddress: string;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
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
      }}
    ),

  // Get order by ID (Authenticated 🔒)
  getById: (id: string) =>
    axiosClient.get<any, Order>(ORDERS_ENDPOINTS.GET_BY_ID.replace(':id', id)),
};

export default orderService;
