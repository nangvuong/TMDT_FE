export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// ============= AUTH Module (Không yêu cầu JWT) =============
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',      // POST - 201
  LOGIN: '/auth/login',             // POST - 200
} as const;

// ============= PRODUCTS Module =============
export const PRODUCTS_ENDPOINTS = {
  GET_ALL: '/products',             // GET - 200 (public)
  GET_BY_ID: '/products/:id',       // GET - 200 (public)
  SEARCH: '/products/search',       // GET - 200 (public)
} as const;

// ============= CATEGORIES Module =============
export const CATEGORIES_ENDPOINTS = {
  GET_ALL: '/categories',           // GET - 200 (public)
  GET_BY_ID: '/categories/:id',     // GET - 200 (public)
} as const;

// ============= CART Module (Require JWT 🔒) =============
export const CART_ENDPOINTS = {
  GET_CART: '/cart',                // GET - 200 (Authenticated)
  ADD_ITEM: '/cart/items',          // POST - 201 (Authenticated)
  REMOVE_ITEM: '/cart/items/:itemId', // DELETE - 200 (Authenticated)
  CLEAR_CART: '/cart',              // DELETE - 200 (Authenticated)
} as const;

// ============= ORDERS Module (Require JWT 🔒) =============
export const ORDERS_ENDPOINTS = {
  CHECKOUT: '/orders/checkout',     // POST - 201 (Authenticated)
  GET_MY_ORDERS: '/orders/my',      // GET - 200 (Authenticated)
  GET_BY_ID: '/orders/:id',         // GET - 200 (Authenticated)
} as const;

// ============= PROFILE Module (Require JWT 🔒) =============
export const PROFILE_ENDPOINTS = {
  GET: '/profile',                  // GET - 200 (Authenticated)
  UPDATE: '/profile',               // PUT - 200 (Authenticated)
} as const;

// ============= UPLOAD Module (Cloudinary - Require JWT 🔒) =============
export const UPLOAD_ENDPOINTS = {
  SINGLE: '/upload/single',         // POST - 201 (Authenticated)
  MULTIPLE: '/upload/multiple',     // POST - 201 (Authenticated, max 10 files)
  DELETE: '/upload/:publicId',      // DELETE - 200 (Authenticated)
} as const;

// ============= HTTP Status Codes =============
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ============= Order Status Values =============
export const ORDER_STATUS = {
  PENDING: 'PENDING',           // Chờ xử lý
  PROCESSING: 'PROCESSING',     // Đang xử lý
  SHIPPED: 'SHIPPED',           // Đã gửi
  DELIVERED: 'DELIVERED',       // Đã giao
  CANCELLED: 'CANCELLED',       // Đã hủy
} as const;

// ============= User Roles =============
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
} as const;

// ============= Fitness Goals =============
export const FITNESS_GOALS = {
  WEIGHT_LOSS: 'weight_loss',       // Giảm cân
  MUSCLE_GAIN: 'muscle_gain',       // Tăng cơ
  MAINTENANCE: 'maintenance',       // Duy trì
  ENDURANCE: 'endurance',           // Thể lực
} as const;

// ============= Product Tags =============
export const PRODUCT_TAGS = {
  BESTSELLER: 'bestseller',
  NEW: 'new',
  ON_SALE: 'on-sale',
  FEATURED: 'featured',
  TRENDING: 'trending',
} as const;

// ============= Query Parameters (Pagination) =============
export const QUERY_PARAMS = {
  PAGE: 'page',         // default: 1
  LIMIT: 'limit',       // default: 10
  CATEGORY_ID: 'categoryId',
} as const;

// ============= Authorization =============
export const AUTH_HEADER = {
  BEARER: 'Bearer',
  AUTHORIZATION: 'Authorization',
} as const;

// ============= Default Pagination =============
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

// ============= Upload Configuration =============
export const UPLOAD_CONFIG = {
  MAX_FILES: 10,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ============= All Endpoints (Combined) =============
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...PRODUCTS_ENDPOINTS,
  ...CATEGORIES_ENDPOINTS,
  ...CART_ENDPOINTS,
  ...ORDERS_ENDPOINTS,
  ...PROFILE_ENDPOINTS,
  ...UPLOAD_ENDPOINTS,
} as const;
