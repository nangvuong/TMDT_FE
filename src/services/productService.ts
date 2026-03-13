import axiosClient from './axiosClient';
import type { Product, Category } from '../types/product';
import { PRODUCTS_ENDPOINTS, CATEGORIES_ENDPOINTS, QUERY_PARAMS, DEFAULT_PAGINATION } from '../constants/api';

interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
}

interface GetCategoryParams {
    page?: number;
    limit?: number;
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
        }}
    ),

  // Get category by ID
  getCategoryById: (id: string) =>
    axiosClient.get<any, Category>(CATEGORIES_ENDPOINTS.GET_BY_ID.replace(':id', id)),
};

export default productService;
