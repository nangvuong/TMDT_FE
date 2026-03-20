// ========== Services ==========
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as cartService } from './cartService';
export { default as orderService } from './orderService';
export { default as userService } from './userService';
export { default as uploadService } from './uploadService';
export { default as wishlistService } from './wishlistService';
export { default as couponService } from './couponService';
export { addressService } from './addressService';
export { default as axiosClient } from './axiosClient';

// ========== Types ==========
export type { AddToCartPayload } from './cartService';
export type { CheckoutPayload } from './orderService';
export type { UploadResponse, UploadMultipleResponse } from './uploadService';
export type { WishlistItem, GetWishlistResponse, GetWishlistParams } from './wishlistService';
