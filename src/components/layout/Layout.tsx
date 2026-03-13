import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import type { Category } from '../../types/product';

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  cartCount?: number;
  wishlistCount?: number;
  isUserLoggedIn?: boolean;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  categories = [],
  cartCount = 0,
  wishlistCount = 0,
  isUserLoggedIn = false,
  onSearch,
  onCartClick,
  onWishlistClick,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        categories={categories}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isUserLoggedIn={isUserLoggedIn}
        onSearch={onSearch}
        onCartClick={onCartClick}
        onWishlistClick={onWishlistClick}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
