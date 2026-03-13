// ========== Services ==========
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as cartService } from './cartService';
export { default as orderService } from './orderService';
export { default as userService } from './userService';
export { default as uploadService } from './uploadService';
export { default as axiosClient } from './axiosClient';

// ========== Types ==========
export type { AddToCartPayload } from './cartService';
export type { CheckoutPayload } from './orderService';
export type { UploadResponse, UploadMultipleResponse } from './uploadService';
