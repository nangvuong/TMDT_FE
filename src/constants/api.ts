export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const RECOMMENDATION_BASE_URL = import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:8002';

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

// ============= REVIEWS Module =============
export const REVIEWS_ENDPOINTS = {
  GET_PRODUCT_REVIEWS: '/reviews/product/:productId', // GET - 200 (public)
  POST_REVIEW: '/reviews',                            // POST - 201 (Authenticated)
} as const;

// ============= CART Module (Require JWT 🔒) =============
export const CART_ENDPOINTS = {
  GET_CART: '/cart',                // GET - 200 (Authenticated) - Returns: Cart { id, userId, items[], ... }
  ADD_ITEM: '/cart/items',          // POST - 201 (Authenticated) - Body: { productId, quantity } - Returns: Cart (full cart with all items)
  REMOVE_ITEM: '/cart/items/:itemId', // DELETE - 200 (Authenticated) - Returns: Cart (updated cart with remaining items)
  CLEAR_CART: '/cart',              // DELETE - 200 (Authenticated) - Clears cart
} as const;

// ============= ORDERS Module (Require JWT 🔒) =============
export const ORDERS_ENDPOINTS = {
  CHECKOUT: '/orders/checkout',     // POST - 201 (Authenticated) - Body: { shippingAddress, couponCode?, notes? } - Returns: Order
  GET_MY_ORDERS: '/orders/my',      // GET - 200 (Authenticated) - Returns: { data: Order[], meta: { page, limit, totalItems, totalPages } }
  GET_BY_ID: '/orders/:id',         // GET - 200 (Authenticated) - Returns: Order
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

// ============= WISHLIST Module (Require JWT 🔒) =============
export const WISHLIST_ENDPOINTS = {
  GET: '/wishlist',                 // GET - 200 (Authenticated, with pagination)
  ADD: '/wishlist/:productId',      // POST - 201 (Authenticated)
  REMOVE: '/wishlist/:productId',   // DELETE - 200 (Authenticated)
} as const;

// ============= COUPONS Module (Require JWT 🔒) =============
export const COUPONS_ENDPOINTS = {
  VALIDATE: '/coupons/validate',    // POST - 200 (Authenticated) - Query: ?orderAmount=500000
} as const;

// ============= ADDRESSES Module (Require JWT 🔒) =============
export const ADDRESSES_ENDPOINTS = {
  GET_ALL: '/addresses',            // GET - 200 (Authenticated) - Returns all user addresses
  GET_BY_ID: '/addresses/:id',      // GET - 200 (Authenticated)
  CREATE: '/addresses',             // POST - 201 (Authenticated) - Body: CreateAddressDto
  UPDATE: '/addresses/:id',         // PUT - 200 (Authenticated) - Body: UpdateAddressDto
  DELETE: '/addresses/:id',         // DELETE - 200 (Authenticated)
} as const;

// ============= PAYMENT Module (Require JWT 🔒) =============
export const PAYMENT_ENDPOINTS = {
  CREATE_TRANSACTION: '/payment/create', // POST - 201 (Authenticated) - Body: { orderId, paymentMethod? } - Returns: Transaction with QR code
  CHECK_PAYMENT: '/payment/check',   // POST - 200 (Authenticated) - Body: { transactionCode } - Returns: { status, message, transaction }
  CHECK_PAYMENT_GET: '/payment/check/:transactionCode', // GET - 200 (Authenticated) - Returns: { status, message, transaction }
  GET_TRANSACTIONS: '/payment/transactions', // GET - 200 (Authenticated) - Returns: Transaction[]
  GET_TRANSACTION: '/payment/transactions/:id', // GET - 200 (Authenticated) - Returns: Transaction
} as const;

// ============= AI RECOMMENDATION Module (Public) =============
export const RECOMMENDATION_ENDPOINTS = {
  HEALTH: '/health',                           // GET - 200 (public) - Health check
  SIMILAR: '/similar/:productId',              // GET - 200 (public) - Get similar product IDs
  RECOMMEND: '/recommend/:productId',          // GET - 200 (public) - Get product with similar products (all-in-one)
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
  PENDING: 'pending',           // Chờ xử lý
  CONFIRMED: 'confirmed',       // Đã xác nhận
  PROCESSING: 'processing',     // Đang xử lý
  DELIVERED: 'delivered',       // Đã giao
  CANCELLED: 'cancelled',       // Đã hủy
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
  ...REVIEWS_ENDPOINTS,
  ...CART_ENDPOINTS,
  ...ORDERS_ENDPOINTS,
  ...PROFILE_ENDPOINTS,
  ...UPLOAD_ENDPOINTS,
  ...WISHLIST_ENDPOINTS,
  ...COUPONS_ENDPOINTS,
  ...ADDRESSES_ENDPOINTS,
  ...PAYMENT_ENDPOINTS,
} as const;
