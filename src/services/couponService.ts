import axiosClient from './axiosClient';
import { COUPONS_ENDPOINTS } from '../constants/api';
import type { Coupon } from '../types';

/**
 * Coupon Service - Manage coupon validation and discount calculation
 */
const couponService = {
  /**
   * Validate coupon code before checkout
   * @param code - Coupon code to validate
   * @param orderAmount - Order subtotal to check against minOrderAmount
   * @returns Coupon details including discount info
   */
  async validateCoupon(code: string, orderAmount: number): Promise<Coupon> {
    const response = await axiosClient.post<any, Coupon>(
      `${COUPONS_ENDPOINTS.VALIDATE}?orderAmount=${orderAmount}`,
      { code },
    );
    return response;
  },

  /**
   * Calculate discount amount based on coupon and order amount
   * @param coupon - Coupon object with discount details
   * @param orderAmount - Order subtotal
   * @returns Discount amount
   */
  calculateDiscount(coupon: Coupon, orderAmount: number): number {
    if (!coupon.isActive) {
      return 0;
    }

    // Check if order meets minimum amount
    if (orderAmount < coupon.minOrderAmount) {
      return 0;
    }

    let discountAmount = 0;

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = coupon.discountValue;
    }

    // Cap discount at maxDiscountAmount if specified
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    return discountAmount;
  },

  /**
   * Format discount display text
   * @param coupon - Coupon object
   * @returns Formatted discount text (e.g., "10%" or "50,000 VND")
   */
  formatDiscount(coupon: Coupon): string {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}%`;
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      return `${coupon.discountValue.toLocaleString('vi-VN')} VND`;
    }
    return '';
  },
};

export default couponService;
