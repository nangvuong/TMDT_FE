import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import FloatingActionButton from '../common/FAB/FloatingActionButton';
import ScrollToTopButton from '../common/FAB/ScrollToTopButton';
import type { Category } from '../../types/product';

interface LayoutProps {
  children: React.ReactNode;
  categories?: Category[];
  isLoadingCategories?: boolean;
  cartCount?: number;
  onCartClick?: () => void;
  onProfileMenuClick?: () => void;
  currentCategoryPage?: number;
  itemsPerPage?: number;
  totalCategoryPages?: number;
  onCategoryPageChange?: (page: number, limit?: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  categories = [],
  isLoadingCategories = false,
  cartCount = 0,
  onCartClick,
  onProfileMenuClick,
  currentCategoryPage = 1,
  itemsPerPage = 6,
  totalCategoryPages = 1,
  onCategoryPageChange,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        cartCount={cartCount}
        onCartClick={onCartClick}
        onProfileMenuClick={onProfileMenuClick}
        currentCategoryPage={currentCategoryPage}
        itemsPerPage={itemsPerPage}
        totalCategoryPages={totalCategoryPages}
        onCategoryPageChange={onCategoryPageChange}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingActionButton />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
