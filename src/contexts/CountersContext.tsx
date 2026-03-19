import React, { createContext, useContext, useState, useMemo } from 'react';

interface CountersContextType {
  wishlistCount: number;
  setWishlistCount: (count: number) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
}

const CountersContext = createContext<CountersContextType | undefined>(undefined);

export const CountersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Memoize context value to prevent unnecessary re-renders when state changes
  const value = useMemo(
    () => ({ wishlistCount, setWishlistCount, cartCount, setCartCount }),
    [wishlistCount, cartCount]
  );

  return (
    <CountersContext.Provider value={value}>
      {children}
    </CountersContext.Provider>
  );
};

/**
 * Hook to use counters context
 */
export const useCountersContext = () => {
  const context = useContext(CountersContext);
  if (!context) {
    throw new Error('useCountersContext must be used within CountersProvider');
  }
  return context;
};
