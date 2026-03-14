import React, { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout'
import Hero from './components/Hero';
import AboutPreview from './components/AboutPreview';
import Category from './components/Category';
import Products from './components/Products';
import WhyChooseUs from './components/WhyChooseUs';
import { useIsLoggedIn } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';

/**
 * Home Page - Main landing page with product categories, hero section, and featured products
 */
const Home: React.FC = () => {
  // Update page title
  usePageTitle('Home | Fitness Mart');

  const { isLoggedIn } = useIsLoggedIn();

  // Reset scroll position on page load
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create ref for Products section
  const productsRef = useRef<HTMLDivElement>(null);

  // Use categories hook with initial pagination
  const { 
    categories, 
    isLoading: isLoadingCategories, 
    pagination,
    setPage: setCategoryPage,
    setLimit: setCategoryLimit,
  } = useCategories({ page: 1, limit: 6 });

  // Mock state for header
  const [wishlistCount] = useState(5);
  const cartCount = 3;
  const isUserLoggedIn = isLoggedIn;

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };



  const handleCategoryPageChange = (page: number, limit?: number) => {
    setCategoryPage(page);
    if (limit && limit !== pagination.limit) {
      setCategoryLimit(limit);
    }
  };

  const handleHeroButtonClick = () => {
    console.log('Shop Now clicked');
    // Scroll to Products section with custom smooth animation
    if (productsRef.current) {
      const headerHeight = 80; // Adjust based on your header height
      const targetPosition = productsRef.current.getBoundingClientRect().top + window.scrollY - headerHeight;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 1.5 seconds - adjust this value to control scroll speed
      let start: number | null = null;

      const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const elapsed = currentTime - start;
        const run = easeInOutQuad(elapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (elapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isUserLoggedIn={isUserLoggedIn}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={pagination.page}
      itemsPerPage={pagination.limit}
      totalCategoryPages={pagination.totalPages}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <Hero
        headline="Nâng Tầm Hành Trình Của Bạn"
        subheadline="Thiết bị tập gym, thực phẩm bổ sung và thời trang thể thao dành cho mọi cấp độ luyện tập"
        buttonLabel="Khám Phá Sản Phẩm"
        onButtonClick={handleHeroButtonClick}
      />
      <AboutPreview />
      <Category />
      <div ref={productsRef}>
        <Products />
      </div>
      <WhyChooseUs />
    </Layout>
  );
};

export default Home;
