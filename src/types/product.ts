export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
export type ProductTag = 'bestseller' | 'new' | 'on-sale' | 'featured' | 'trending';
export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  user: User;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string; // UUID
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  products?: Product[]; // Products in this category
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string; // UUID
  name: string;
  description?: string;
  price: number | string; // Can be string from API
  stock: number;
  tags?: string[];
  images?: string[];
  embedding?: number[] | null; // Vector embedding for recommendations
  isActive: boolean;
  categoryId?: string; // FK to Categories
  averageRating?: number | string;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // UUID
  cartId: string; // FK to Carts
  productId: string; // FK to Products
  quantity: number;
  // Populated if needed
  product?: Product;
}

export interface Cart {
  id: string; // UUID
  userId: string; // FK to Users
  items?: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string; // UUID
  orderId: string; // FK to Orders
  productId: string; // FK to Products
  quantity: number;
  priceAtPurchase: number;
  // Populated if needed
  product?: Product;
}

export interface Order {
  id: string; // UUID
  userId: string; // FK to Users
  status: OrderStatus;
  totalAmount: number;
  discountAmount?: number;
  couponId?: string;
  couponCode?: string;
  shippingAddress: string;
  items?: OrderItem[];
  coupon?: Coupon;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export const DISCOUNT_TYPE = {
  PERCENTAGE: 'PERCENTAGE' as const,
  FIXED_AMOUNT: 'FIXED_AMOUNT' as const,
} as const;

export interface Coupon {
  id: string; // UUID
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateCouponResponse {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ============= ADDRESSES =============
export interface Address {
  id: string; // UUID
  street: string;
  state: string;
  city: string;
  isDefault: boolean;
  userId: string; // FK to Users
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  street: string;
  state: string;
  city: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto {
  street?: string;
  state?: string;
  city?: string;
  isDefault?: boolean;
}

