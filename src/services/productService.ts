import axiosClient from './axiosClient';
import type { Product, Category, Review } from '../types/product';
import { PRODUCTS_ENDPOINTS, CATEGORIES_ENDPOINTS, REVIEWS_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

export const ProductSortBy = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NEWEST: 'newest',
} as const;

type ProductSortBy = typeof ProductSortBy[keyof typeof ProductSortBy];

interface GetProductsParams {
  /**
   * Page number for pagination
   * @example 1
   * @default 1
   */
  page?: number;

  /**
   * Number of items per page
   * @example 12
   * @default 10
   * @max 100
   */
  limit?: number;

  /**
   * Search products by name or description
   * @example "whey protein"
   * @optional
   */
  search?: string;

  /**
   * Filter by price range (min price in VND)
   * @example 100000
   * @optional
   */
  minPrice?: number;

  /**
   * Filter by price range (max price in VND)
   * @example 2000000
   * @optional
   */
  maxPrice?: number;

  /**
   * Sort field: 'price_asc', 'price_desc', 'newest'
   * @example "price_asc"
   * @default "newest"
   * @optional
   */
  sortBy?: ProductSortBy | 'price_asc' | 'price_desc' | 'newest';
}

export interface GetCategoryParams {
  /**
   * Page number for pagination
   * @example 1
   * @default 1
   */
  page?: number;

  /**
   * Number of items per page
   * @example 8
   * @default 10
   * @max 100
   */
  limit?: number;

  /**
   * Search categories by name or description
   * @example "protein"
   * @optional
   */
  search?: string;

  /**
   * Sort field: 'name', 'createdAt'
   * @example "name"
   * @default "createdAt"
   * @optional
   */
  sortBy?: 'name' | 'createdAt';

  /**
   * Sort order: 'asc' (ascending) or 'desc' (descending)
   * @example "asc"
   * @default "desc"
   * @optional
   */
  order?: 'asc' | 'desc';

  /**
   * Filter only active categories
   * @example true
   * @default true
   * @optional
   */
  isActive?: boolean;

  /**
   * Filter categories by number of products
   * @example 5
   * @optional
   */
  minProducts?: number;
}

export interface GetProductReviewsParams {
  /**
   * Page number for pagination
   * @example 1
   * @default 1
   */
  page?: number;

  /**
   * Number of reviews per page
   * @example 10
   * @default 10
   * @max 100
   */
  limit?: number;
}

export interface CreateReviewParams {
  /**
   * Product ID to review
   * @example "550e8400-e29b-41d4-a716-446655440000"
   * @required
   */
  productId: string;

  /**
   * Rating from 1 to 5
   * @example 5
   * @required
   * @min 1
   * @max 5
   */
  rating: number;

  /**
   * Review comment
   * @example "Sản phẩm tốt lắm!"
   * @required
   * @minLength 1
   * @maxLength 1000
   */
  comment: string;
}

const productService = {
  // ====== PRODUCTS (Public Read-Only) ======
  // Get all products with optional filters
  getAll: (params?: GetProductsParams) =>
    axiosClient.get<any, { data: Product[]; total: number; page: number; limit: number }>(
      PRODUCTS_ENDPOINTS.GET_ALL,
      { params: {
        page: params?.page || DEFAULT_PAGINATION.PAGE,
        limit: params?.limit || DEFAULT_PAGINATION.LIMIT,
        ...(params?.search && { search: params.search }),
        ...(params?.minPrice !== undefined && { minPrice: params.minPrice }),
        ...(params?.maxPrice !== undefined && { maxPrice: params.maxPrice }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
      }}
    ),

  // Get product by ID
  getById: (id: string) =>
    axiosClient.get<any, Product>(PRODUCTS_ENDPOINTS.GET_BY_ID.replace(':id', id)),

  // ====== CATEGORIES (Public Read-Only) ======
  // Get all categories
  getAllCategories: (params? : GetCategoryParams) =>
    axiosClient.get<any, { data: Category[], meta: { page: number, limit: number, totalItems: number, totalPages: number}}>(
        CATEGORIES_ENDPOINTS.GET_ALL,
        {params :{
            [QUERY_PARAMS.PAGE]: params?.page || DEFAULT_PAGINATION.PAGE,
            [QUERY_PARAMS.LIMIT]: params?.limit || DEFAULT_PAGINATION.LIMIT,
            ...(params?.search && { search: params.search }),
            ...(params?.sortBy && { sortBy: params.sortBy }),
            ...(params?.order && { order: params.order }),
            ...(params?.isActive !== undefined && { isActive: params.isActive }),
            ...(params?.minProducts !== undefined && { minProducts: params.minProducts }),
        }}
    ),

  // Get category by ID
  getCategoryById: (id: string) =>
    axiosClient.get<any, Category>(CATEGORIES_ENDPOINTS.GET_BY_ID.replace(':id', id)),

  // ====== REVIEWS (Public Read-Only) ======
  // Get reviews for a specific product
  getProductReviews: (productId: string, params?: GetProductReviewsParams) =>
    axiosClient.get<any, { data: Review[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(
      REVIEWS_ENDPOINTS.GET_PRODUCT_REVIEWS.replace(':productId', productId),
      {
        params: {
          page: params?.page || DEFAULT_PAGINATION.PAGE,
          limit: params?.limit || DEFAULT_PAGINATION.LIMIT,
        },
      }
    ),

  // ====== REVIEWS (Authenticated) ======
  // Create a new review for a product (Requires JWT)
  createReview: (data: CreateReviewParams) =>
    axiosClient.post<any, Review>(
      REVIEWS_ENDPOINTS.POST_REVIEW,
      {
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      }
    ),
};

export default productService;
export type { GetProductsParams };
