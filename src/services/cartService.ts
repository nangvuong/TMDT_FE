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
  // Returns the complete updated cart with all items
  addToCart: (data: AddToCartPayload) =>
    axiosClient.post<any, Cart>(CART_ENDPOINTS.ADD_ITEM, data),

  // Remove item from cart (Authenticated 🔒)
  // Returns the complete updated cart with remaining items
  removeFromCart: (itemId: string) =>
    axiosClient.delete<any, Cart>(CART_ENDPOINTS.REMOVE_ITEM.replace(':itemId', itemId)),

  // Clear entire cart (Authenticated 🔒)
  clearCart: () =>
    axiosClient.delete(CART_ENDPOINTS.CLEAR_CART),
};

export default cartService;
