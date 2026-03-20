// ========== User Types ==========
export type { User, PhysicalProfile, LoginPayload, RegisterPayload, AuthResponse } from './user';
export type { UserRole, FitnessGoal } from './user';

// ========== Product Types ==========
export type { 
  Product, 
  Category, 
  Cart, 
  CartItem, 
  Order, 
  OrderItem,
  Coupon,
  ValidateCouponResponse,
  DiscountType,
  Address,
  CreateAddressDto,
  UpdateAddressDto
} from './product';
export { DISCOUNT_TYPE } from './product';
export type { OrderStatus, ProductTag } from './product';
