import axiosClient from './axiosClient';
import type { Product, Category } from '../types/product';
import { PRODUCTS_ENDPOINTS, CATEGORIES_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

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
   * Filter products by category UUID
   * @example "550e8400-e29b-41d4-a716-446655440001"
   * @optional
   */
  categoryId?: string;

  /**
   * Search products by name or description
   * @example "whey protein"
   * @optional
   */
  search?: string;

  /**
   * Filter products by tags (comma-separated)
   * @example "best-seller,whey,chocolate"
   * @optional
   */
  tags?: string;

  /**
   * Sort field: 'name', 'price', 'stock', 'rating', 'createdAt'
   * @example "price"
   * @default "createdAt"
   * @optional
   */
  sortBy?: 'name' | 'price' | 'stock' | 'rating' | 'createdAt';

  /**
   * Sort order: 'asc' (ascending) or 'desc' (descending)
   * @example "asc"
   * @default "desc"
   * @optional
   */
  order?: 'asc' | 'desc';

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
   * Filter by stock availability
   * true = only in-stock products
   * @example true
   * @optional
   */
  inStockOnly?: boolean;

  /**
   * Filter by fitness goal tags
   * @example "muscle-gain,weight-loss"
   * @optional
   */
  fitnessGoal?: string;
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

const productService = {
  // ====== PRODUCTS (Public Read-Only) ======
  // Get all products with optional filters
  getAll: (params?: GetProductsParams) =>
    axiosClient.get<any, { data: Product[]; total: number; page: number; limit: number }>(
      PRODUCTS_ENDPOINTS.GET_ALL,
      { params: {
        [QUERY_PARAMS.PAGE]: params?.page || DEFAULT_PAGINATION.PAGE,
        [QUERY_PARAMS.LIMIT]: params?.limit || DEFAULT_PAGINATION.LIMIT,
        ...(params?.categoryId && { [QUERY_PARAMS.CATEGORY_ID]: params.categoryId }),
        ...(params?.search && { search: params.search }),
        ...(params?.tags && { tags: params.tags }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.order && { order: params.order }),
        ...(params?.minPrice !== undefined && { minPrice: params.minPrice }),
        ...(params?.maxPrice !== undefined && { maxPrice: params.maxPrice }),
        ...(params?.inStockOnly !== undefined && { inStockOnly: params.inStockOnly }),
        ...(params?.fitnessGoal && { fitnessGoal: params.fitnessGoal }),
      }}
    ),

  // Get product by ID
  getById: (id: string) =>
    axiosClient.get<any, Product>(PRODUCTS_ENDPOINTS.GET_BY_ID.replace(':id', id)),

  // Search products
  search: (keyword: string) =>
    axiosClient.get<any, Product[]>(PRODUCTS_ENDPOINTS.SEARCH, { 
      params: { q: keyword } 
    }),

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
};

export default productService;
export type { GetProductsParams };
