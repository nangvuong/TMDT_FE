import { useState, useCallback, useEffect } from 'react';
import { couponService } from '../services';
import { formatPrice } from '../utils/formatPrice';
import type { Coupon } from '../types';

/**
 * Hook để quản lý coupon validation và discount calculation
 * @param orderAmount - Subtotal của order để validate coupon
 */
export const useCoupon = (orderAmount: number = 0) => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  /**
   * Validate và áp dụng coupon code
   */
  const validateCoupon = useCallback(
    async (code: string) => {
      if (!code) {
        setError('Vui lòng nhập mã giảm giá');
        return null;
      }

      if (!orderAmount) {
        setError('Vui lòng chọn sản phẩm để áp dụng mã');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const validatedCoupon = await couponService.validateCoupon(code, orderAmount);

        // Check if order amount meets minimum requirement
        if (orderAmount < validatedCoupon.minOrderAmount) {
          const needAmount = validatedCoupon.minOrderAmount - orderAmount;
          setError(
            `Bạn cần mua thêm ${formatPrice(needAmount)} để sử dụng mã này (Tối thiểu: ${formatPrice(validatedCoupon.minOrderAmount)})`
          );
          setCoupon(null);
          setDiscount(0);
          return null;
        }

        setCoupon(validatedCoupon);

        // Calculate discount
        const calculatedDiscount = couponService.calculateDiscount(
          validatedCoupon,
          orderAmount,
        );
        setDiscount(calculatedDiscount);

        return { coupon: validatedCoupon, discount: calculatedDiscount };
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Mã giảm giá không hợp lệ hoặc đã hết hạn';
        setError(errorMessage);
        setCoupon(null);
        setDiscount(0);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orderAmount],
  );

  /**
   * Xóa coupon đã áp dụng
   */
  const clearCoupon = useCallback(() => {
    setCoupon(null);
    setDiscount(0);
    setError(null);
  }, []);

  /**
   * Recalculate discount khi orderAmount thay đổi
   */
  const recalculateDiscount = useCallback(() => {
    if (coupon && orderAmount > 0) {
      const calculatedDiscount = couponService.calculateDiscount(coupon, orderAmount);
      setDiscount(calculatedDiscount);
      return calculatedDiscount;
    }
    return 0;
  }, [coupon, orderAmount]);

  /**
   * Auto-recalculate discount khi orderAmount thay đổi (user chọn thêm items)
   */
  useEffect(() => {
    if (coupon) {
      // Coupon đã áp dụng, có thêm items được chọn
      if (orderAmount && orderAmount > 0) {
        // Kiểm tra nếu không đủ minimum amount nữa (user bỏ chọn items)
        if (orderAmount < coupon.minOrderAmount) {
          const needAmount = coupon.minOrderAmount - orderAmount;
          setError(
            `Bạn cần mua thêm ${formatPrice(needAmount)} để tiếp tục sử dụng mã này`
          );
          setDiscount(0);
        } else {
          // Đủ điều kiện, tính lại discount
          setError(null);
          const calculatedDiscount = couponService.calculateDiscount(coupon, orderAmount);
          setDiscount(calculatedDiscount);
        }
      } else {
        // User bỏ hết lựa chọn
        setError('Vui lòng chọn sản phẩm để tiếp tục sử dụng mã');
        setDiscount(0);
      }
    }
  }, [coupon, orderAmount]);

  return {
    coupon,
    discount,
    isLoading,
    error,
    validateCoupon,
    clearCoupon,
    recalculateDiscount,
    isCouponApplied: coupon !== null,
  };
};
