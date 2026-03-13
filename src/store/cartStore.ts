import type { Cart, CartItem } from '../types/product';

interface CartState extends Omit<Cart, 'items'> {
  items: CartItem[];
  total: number;
}

// This is a placeholder for state management
// Consider using Redux, Zustand, or other state management libraries

const initialState: CartState = {
  id: '',
  userId: '',
  items: [],
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const cartStore = initialState;

export const addItem = (item: CartItem) => {
  const existingItem = cartStore.items.find((i) => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cartStore.items.push(item);
  }
  updateTotal();
};

export const removeItem = (id: string) => {
  cartStore.items = cartStore.items.filter((i) => i.id !== id);
  updateTotal();
};

export const updateItemQuantity = (id: string, quantity: number) => {
  const item = cartStore.items.find((i) => i.id === id);
  if (item) {
    item.quantity = Math.max(0, quantity);
    updateTotal();
  }
};

export const clearCart = () => {
  cartStore.items = [];
  cartStore.total = 0;
};

export const updateTotal = () => {
  cartStore.total = cartStore.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
};

export const setCart = (cart: Cart) => {
  cartStore.id = cart.id;
  cartStore.userId = cart.userId;
  cartStore.items = cart.items || [];
  cartStore.createdAt = cart.createdAt;
  cartStore.updatedAt = cart.updatedAt;
  updateTotal();
};
