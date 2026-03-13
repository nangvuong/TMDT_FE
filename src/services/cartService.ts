import axiosClient from './axiosClient';
import type { Cart, CartItem } from '../types/product';
import { CART_ENDPOINTS } from '../constants/api';

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

const cartService = {
  // Get user's cart (Authenticated 🔒)
  getCart: () =>
    axiosClient.get<any, Cart>(CART_ENDPOINTS.GET_CART),

  // Add item to cart (Authenticated 🔒)
  addToCart: (data: AddToCartPayload) =>
    axiosClient.post<any, CartItem>(CART_ENDPOINTS.ADD_ITEM, data),

  // Remove item from cart (Authenticated 🔒)
  removeFromCart: (itemId: string) =>
    axiosClient.delete(CART_ENDPOINTS.REMOVE_ITEM.replace(':itemId', itemId)),

  // Clear entire cart (Authenticated 🔒)
  clearCart: () =>
    axiosClient.delete(CART_ENDPOINTS.CLEAR_CART),
};

export default cartService;
