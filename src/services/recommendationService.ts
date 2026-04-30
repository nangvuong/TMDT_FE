import axios from 'axios';
import { RECOMMENDATION_BASE_URL, RECOMMENDATION_ENDPOINTS } from '../constants/api';
import type { Product } from '../types/product';

// Create a separate axios instance for recommendation API
const recommendationClient = axios.create({
  baseURL: RECOMMENDATION_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= Types =============

/**
 * Response type for similar products (IDs only)
 */
export interface SimilarProductsResponse {
  success: boolean;
  product_id: string;
  similar_ids: string[];
  count: number;
}

/**
 * Response type for health check
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
}

/**
 * Response type for recommendations (all-in-one)
 */
export interface RecommendationResponse {
  success: boolean;
  product: Product;
  similar_products: Product[];
  count: number;
}



/**
 * Parameters for getting recommendations
 */
export interface RecommendationParams {
  limit?: number; // 1-20, default 5
}

/**
 * Parameters for getting similar products
 */
export interface SimilarParams {
  limit?: number; // 1-50, default 10
}

// ============= Recommendation Service =============

const recommendationService = {
  // ====== Health Check ======
  /**
   * Check if the recommendation server is healthy
   */
  healthCheck: () =>
    recommendationClient.get<HealthCheckResponse>(RECOMMENDATION_ENDPOINTS.HEALTH),

  // ====== Similar Products (IDs only) ======
  /**
   * Get similar product IDs for a given product
   * Returns only IDs, frontend needs to fetch details separately
   *
   * @param productId - The product ID to find similar products for
   * @param limit - Number of similar products to return (1-50, default 10)
   */
  getSimilar: (productId: string, params?: SimilarParams) =>
    recommendationClient.get<SimilarProductsResponse>(
      RECOMMENDATION_ENDPOINTS.SIMILAR.replace(':productId', productId),
      {
        params: {
          limit: params?.limit || 10,
        },
      }
    ),

  // ====== Recommendations (All-in-one) ======
  /**
   * Get product details with similar products in one request
   * This is the most efficient way to get recommendations
   *
   * @param productId - The product ID to get recommendations for
   * @param limit - Number of similar products to return (1-20, default 5)
   */
  getRecommendation: (productId: string, params?: RecommendationParams) =>
    recommendationClient.get<RecommendationResponse>(
      RECOMMENDATION_ENDPOINTS.RECOMMEND.replace(':productId', productId),
      {
        params: {
          limit: params?.limit || 5,
        },
      }
    ),

};

export default recommendationService;
