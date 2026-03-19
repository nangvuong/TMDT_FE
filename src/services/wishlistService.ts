import axiosClient from './axiosClient';
import type { Product } from '../types/product';
import { WISHLIST_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

/**
 * Interface for wishlist item response
 */
export interface WishlistItem {
  id: number;
  product: Product;
  createdAt: string;
}

/**
 * Interface for get wishlist response
 */
export interface GetWishlistResponse {
  data: WishlistItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

/**
 * Parameters for fetching wishlist
 */
export interface GetWishlistParams {
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
}

const wishlistService = {
  /**
   * Get user's wishlist with pagination (Authenticated)
   */
  getWishlist: (params?: GetWishlistParams) =>
    axiosClient.get<any, GetWishlistResponse>(
      WISHLIST_ENDPOINTS.GET,
      {
        params: {
          [QUERY_PARAMS.PAGE]: params?.page || DEFAULT_PAGINATION.PAGE,
          [QUERY_PARAMS.LIMIT]: params?.limit || DEFAULT_PAGINATION.LIMIT,
        },
      }
    ),

  /**
   * Add product to wishlist (Authenticated)
   * @returns 201 Created with wishlist item
   * @throws 400 if product already in wishlist
   * @throws 404 if product not found
   */
  addToWishlist: (productId: string) =>
    axiosClient.post<any, WishlistItem>(
      WISHLIST_ENDPOINTS.ADD.replace(':productId', productId)
    ),

  /**
   * Remove product from wishlist (Authenticated)
   * @returns 200 OK
   * @throws 404 if product not found in wishlist
   */
  removeFromWishlist: (productId: string) =>
    axiosClient.delete<any, { message: string }>(
      WISHLIST_ENDPOINTS.REMOVE.replace(':productId', productId)
    ),

  /**
   * Check if product is in wishlist
   * Utility method that checks local wishlist data
   */
  isInWishlist: (productId: string, wishlistItems: WishlistItem[]): boolean => {
    return wishlistItems.some((item) => item.product.id === productId);
  },
};

export default wishlistService;
