export const formatPrice = (price: number, currency: string = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(price);
};

export const formatCurrency = (
  amount: number,
  locale: string = 'vi-VN',
  currency: string = 'VND'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[^\d.-]/g, ''));
};

export const discountedPrice = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice - (originalPrice * discountPercent) / 100;
};

/**
 * Format price in Vietnamese Dong with ₫ symbol
 * @example formatVND(1000) => "1.000 ₫"
 */
export const formatVND = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Format price with short notation (K, M, B)
 * @example formatPriceShort(1500000) => "1.5M ₫"
 */
export const formatPriceShort = (price: number): string => {
  if (price >= 1_000_000_000) {
    return (price / 1_000_000_000).toFixed(1) + 'B ₫';
  }
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1) + 'M ₫';
  }
  if (price >= 1_000) {
    return (price / 1_000).toFixed(1) + 'K ₫';
  }
  return price + ' ₫';
};
