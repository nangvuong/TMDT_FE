import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import type { Product, Category } from '../types/product';
import type { GetProductsParams, GetCategoryParams } from '../services/productService';

/**
 * Hook for fetching products with filters and pagination
 */
export const useProducts = (initialParams?: GetProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    total: 0,
  });

  const [params, setParams] = useState<GetProductsParams>(initialParams || {});

  const fetchProducts = useCallback(async (fetchParams = params) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getAll(fetchParams);
      setProducts(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setPage = useCallback((page: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, limit, page: 1 }));
  }, []);

  const search = useCallback((query: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const filterByCategory = useCallback((categoryId: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  const filterByTags = useCallback((tags: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, tags, page: 1 }));
  }, []);

  const filterByPrice = useCallback((minPrice?: number, maxPrice?: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  const filterByStock = useCallback((inStockOnly: boolean) => {
    setParams((prev: GetProductsParams) => ({ ...prev, inStockOnly, page: 1 }));
  }, []);

  const sortBy = useCallback((sortBy: 'name' | 'price' | 'stock' | 'rating' | 'createdAt', order: 'asc' | 'desc' = 'desc') => {
    setParams((prev: GetProductsParams) => ({ ...prev, sortBy, order, page: 1 }));
  }, []);

  const filterByFitnessGoal = useCallback((fitnessGoal: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, fitnessGoal, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setParams({ page: 1 });
  }, []);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    pagination,
    // Setters
    setPage,
    setLimit,
    search,
    filterByCategory,
    filterByTags,
    filterByPrice,
    filterByStock,
    sortBy,
    filterByFitnessGoal,
    clearFilters,
    refresh,
    // Current params
    currentParams: params,
  };
};

/**
 * Hook for fetching a single product by ID
 */
export const useProduct = (productId?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    if (!id) {
      setProduct(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  const refresh = useCallback(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refresh,
  };
};

/**
 * Hook for searching products
 */
export const useProductSearch = (initialQuery?: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery || '');

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.search(searchQuery);
      setResults(data || []);
      setQuery(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const clear = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    query,
    search,
    clear,
  };
};

/**
 * Hook for fetching categories with filters and pagination
 */
export const useCategories = (initialParams?: GetCategoryParams) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [params, setParams] = useState<GetCategoryParams>(initialParams || {});

  const fetchCategories = useCallback(async (fetchParams = params) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getAllCategories(fetchParams);
      setCategories(response.data || []);
      setPagination({
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 10,
        totalItems: response.meta?.totalItems || 0,
        totalPages: response.meta?.totalPages || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const search = useCallback((query: string) => {
    setParams((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const filterByActive = useCallback((isActive: boolean) => {
    setParams((prev) => ({ ...prev, isActive, page: 1 }));
  }, []);

  const filterByMinProducts = useCallback((minProducts: number) => {
    setParams((prev) => ({ ...prev, minProducts, page: 1 }));
  }, []);

  const sortBy = useCallback((sortBy: 'name' | 'createdAt', order: 'asc' | 'desc' = 'desc') => {
    setParams((prev) => ({ ...prev, sortBy, order, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setParams({ page: 1 });
  }, []);

  const refresh = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    pagination,
    // Setters
    setPage,
    setLimit,
    search,
    filterByActive,
    filterByMinProducts,
    sortBy,
    clearFilters,
    refresh,
    // Current params
    currentParams: params,
  };
};

/**
 * Hook for fetching a single category by ID with its products
 */
export const useCategory = (categoryId?: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async (id: string) => {
    if (!id) {
      setCategory(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getCategoryById(id);
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
      setCategory(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  const refresh = useCallback(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  return {
    category,
    isLoading,
    error,
    refresh,
  };
};
