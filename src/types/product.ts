export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ProductTag = 'bestseller' | 'new' | 'on-sale' | 'featured' | 'trending';

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
  shippingAddress: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

