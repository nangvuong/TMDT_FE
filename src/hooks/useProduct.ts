import { useState, useEffect, useCallback, useRef } from 'react';
import type { AxiosError } from 'axios';
import productService from '../services/productService';
import recommendationService from '../services/recommendationService';
import type { Product, Category } from '../types/product';
import type { GetProductsParams, GetCategoryParams } from '../services/productService';
import { cacheManager, generateCategoriesCacheKey } from '../utils/cache';
import { useDebouncedCallback } from '../utils/debounce';

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
      
      // Try to get from cache first
      const cacheKey = `products_${JSON.stringify(fetchParams)}`;
      const cachedProducts = cacheManager.get<any>(cacheKey);
      if (cachedProducts) {
        setProducts(cachedProducts.data || []);
        setPagination({
          page: cachedProducts.page || 1,
          limit: cachedProducts.limit || 10,
          total: cachedProducts.total || 0,
        });
        setIsLoading(false);
        return;
      }

      // If no cache, fetch from API
      const response = await productService.getAll(fetchParams);
      setProducts(response.data || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
      });
      // Cache the result for 5 minutes
      cacheManager.set(cacheKey, response, 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Use effect to fetch when params change
  useEffect(() => {
    fetchProducts(params);
  }, [params]);

  const setPage = useCallback((page: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, limit, page: 1 }));
  }, []);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, search: query, page: 1 }));
  }, 500); // 500ms debounce delay

  const search = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const filterByCategory = useCallback((categoryId: string) => {
    setParams((prev: GetProductsParams) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  const filterByPrice = useCallback((minPrice?: number, maxPrice?: number) => {
    setParams((prev: GetProductsParams) => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  const sortBy = useCallback((sortByValue: 'price_asc' | 'price_desc' | 'newest') => {
    setParams((prev: GetProductsParams) => ({ ...prev, sortBy: sortByValue, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setParams({ page: 1 });
  }, []);

  const refresh = useCallback(() => {
    const cacheKey = `products_${JSON.stringify(params)}`;
    cacheManager.clear(cacheKey);
    fetchProducts(params);
  }, [params, fetchProducts]);

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
    filterByPrice,
    sortBy,
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
 * Hook for searching products with debouncing
 */
export const useProductSearch = (initialQuery?: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery || '');

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Use getAll API with search parameter for suggestions (limit to 5 results)
      const response = await productService.getAll({
        search: searchQuery,
        limit: 5,
      });
      setResults(response.data || []);
      setQuery(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useDebouncedCallback(performSearch, 500); // 500ms debounce

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery); // Update UI immediately
    debouncedSearch(searchQuery); // Debounce API call
  }, [debouncedSearch]);

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
  const isFetchingRef = useRef(false); // Prevent duplicate concurrent requests

  const fetchCategories = useCallback(async (fetchParams = params, useCache = true) => {
    const cacheKey = generateCategoriesCacheKey(
      fetchParams.page || 1,
      fetchParams.limit || 10
    );

    // Check cache first if caching is enabled
    if (useCache) {
      const cachedData = cacheManager.get<{
        data: Category[];
        pagination: { page: number; limit: number; totalItems: number; totalPages: number };
      }>(cacheKey);

      if (cachedData) {
        setCategories(cachedData.data);
        setPagination(cachedData.pagination);
        setIsLoading(false);
        return;
      }
    }

    // Prevent duplicate concurrent requests
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const response = await productService.getAllCategories(fetchParams);
      const newCategories = response.data || [];
      const newPagination = {
        page: response.meta?.page || 1,
        limit: response.meta?.limit || 10,
        totalItems: response.meta?.totalItems || 0,
        totalPages: response.meta?.totalPages || 0,
      };

      setCategories(newCategories);
      setPagination(newPagination);

      // Cache the result (5 minutes TTL)
      if (useCache) {
        cacheManager.set(
          cacheKey,
          {
            data: newCategories,
            pagination: newPagination,
          },
          5 * 60 * 1000 // 5 minutes
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [params]);

  useEffect(() => {
    fetchCategories(params);
  }, [params]);

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
    cacheManager.clear(generateCategoriesCacheKey(params.page || 1, params.limit || 10));
    fetchCategories(params, false); // useCache=false to force API call
  }, [params, fetchCategories]);

  const clearCache = useCallback(() => {
    cacheManager.clear(
      generateCategoriesCacheKey(pagination.page, pagination.limit)
    );
  }, [pagination]);

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
    clearCache,
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

/**
 * Hook for fetching categories with explicit cache management
 * Automatically caches results for configurable TTL to reduce API calls
 * Use this if you need more control over cache timing
 */
interface CategoriesPaginationState {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export const useCategoriesWithCache = (
  initialParams?: GetCategoryParams,
  cacheTTL?: number // in milliseconds, defaults to 5 minutes
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CategoriesPaginationState>({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [params, setParams] = useState<GetCategoryParams>(initialParams || {});
  const isFetchingRef = useRef(false); // Prevent duplicate requests

  const fetchCategories = useCallback(
    async (fetchParams = params) => {
      const cacheKey = generateCategoriesCacheKey(
        fetchParams.page || 1,
        fetchParams.limit || 10
      );

      // Check cache first
      const cachedData = cacheManager.get<{
        data: Category[];
        pagination: CategoriesPaginationState;
      }>(cacheKey);

      if (cachedData) {
        setCategories(cachedData.data);
        setPagination(cachedData.pagination);
        setIsLoading(false);
        return;
      }

      // Prevent duplicate concurrent requests
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const response = await productService.getAllCategories(fetchParams);

        const newCategories = response.data || [];
        const newPagination = {
          page: response.meta?.page || 1,
          limit: response.meta?.limit || 10,
          totalItems: response.meta?.totalItems || 0,
          totalPages: response.meta?.totalPages || 0,
        };

        // Update state
        setCategories(newCategories);
        setPagination(newPagination);

        // Cache the result with TTL
        cacheManager.set(
          cacheKey,
          {
            data: newCategories,
            pagination: newPagination,
          },
          cacheTTL || 5 * 60 * 1000 // Default 5 minutes
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [params, cacheTTL]
  );

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

  const clearCache = useCallback(() => {
    cacheManager.clear(
      generateCategoriesCacheKey(pagination.page, pagination.limit)
    );
  }, [pagination]);

  return {
    categories,
    isLoading,
    error,
    pagination,
    setPage,
    setLimit,
    search,
    clearCache,
    refetch: fetchCategories, // Force refresh bypassing cache
  };
};

/**
 * Hook for fetching similar products (IDs only)
 * Use this when you want to fetch product details separately via getById
 */
export const useRecommendations = (productId?: string, limit: number = 10) => {
  const [similarIds, setSimilarIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilar = useCallback(async (id: string) => {
    if (!id) {
      setSimilarIds([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await recommendationService.getSimilar(id, { limit });
      setSimilarIds(response.data?.similar_ids || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch similar products');
      setSimilarIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (productId) {
      fetchSimilar(productId);
    }
  }, [productId, fetchSimilar]);

  const refresh = useCallback(() => {
    if (productId) {
      fetchSimilar(productId);
    }
  }, [productId, fetchSimilar]);

  return {
    similarIds,
    isLoading,
    error,
    refresh,
  };
};

/**
 * Hook for fetching product details with similar products (all-in-one)
 * This is the most efficient way to get recommendations as it combines
 * the product details and similar products in a single request
 */
export const useProductRecommendation = (productId?: string, limit: number = 5) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchRecommendation = useCallback(async (id: string) => {
    if (!id) {
      setProduct(null);
      setSimilarProducts([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Generate cache key based on product ID and limit
      const cacheKey = `recommendation_${id}_${limit}`;

      // Check if we have cached data
      const cachedData = cacheManager.get<any>(cacheKey);
      if (cachedData) {
        setProduct(cachedData.product || null);
        setSimilarProducts(cachedData.similar_products || []);
        setIsLoading(false);
        return;
      }

      // Fetch from API if not in cache
      const response = await recommendationService.getRecommendation(id, { limit });
      const responseData = {
        product: response.data?.product || null,
        similar_products: response.data?.similar_products || [],
      };

      // Cache the recommendation for 15 minutes
      cacheManager.set(cacheKey, responseData, 15 * 60 * 1000);

      setProduct(responseData.product);
      setSimilarProducts(responseData.similar_products);
    } catch (err) {
      setError(err as AxiosError);
      setProduct(null);
      setSimilarProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (productId) {
      fetchRecommendation(productId);
    }
  }, [productId, fetchRecommendation]);

  const refresh = useCallback(() => {
    if (productId) {
      fetchRecommendation(productId);
    }
  }, [productId, fetchRecommendation]);

  return {
    product,
    similarProducts,
    isLoading,
    error,
    refresh,
  };
};

export { ProductSortBy } from '../services/productService';
