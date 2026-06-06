export interface GuestCartItem {
  id: string;        // uuid tự sinh (dùng crypto.randomUUID())
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number | string;
    images?: string[];
    stock?: number;
  };
}

export interface GuestCart {
  items: GuestCartItem[];
}

const GUEST_CART_KEY = 'guest_cart';

export const getGuestCart = (): GuestCart => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (stored) {
      return JSON.parse(stored) as GuestCart;
    }
  } catch (error) {
    console.error('Error reading guest cart from localStorage:', error);
  }
  return { items: [] };
};

const saveGuestCart = (cart: GuestCart): void => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart to localStorage:', error);
  }
};

export const addToGuestCart = (productId: string, quantity: number, product?: any): GuestCart => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    const newItem: GuestCartItem = {
      id: crypto.randomUUID(),
      productId,
      quantity,
      product,
    };
    cart.items.push(newItem);
  }

  saveGuestCart(cart);
  return cart;
};

export const removeFromGuestCart = (itemId: string): GuestCart => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartQuantity = (itemId: string, quantity: number): GuestCart => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(item => item.id === itemId);

  if (existingItemIndex >= 0) {
    if (quantity > 0) {
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      cart.items.splice(existingItemIndex, 1);
    }
    saveGuestCart(cart);
  }
  return cart;
};

export const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error('Error clearing guest cart from localStorage:', error);
  }
};

export const getGuestCartCount = (): number => {
  const cart = getGuestCart();
  return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
};
