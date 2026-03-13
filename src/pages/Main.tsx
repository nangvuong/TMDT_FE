import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout'
import Profile from './Home/Profile';
import type { Category } from '../types/product'
import { useIsLoggedIn } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { usePageTitle } from '../hooks/usePageTitle';
import productService from '../services/productService';

/**
 * Main Page - Main landing page with product categories and search
 */
const Main: React.FC = () => {
  // Update page title
  usePageTitle('Home | Fitness Mart');

  const { isLoggedIn } = useIsLoggedIn();
  const { profile, loading: profileLoading } = useProfile(false);

  // State for display
  const [showProfile, setShowProfile] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Mock state for header
  const cartCount = 3
  const wishlistCount = 5
  const isUserLoggedIn = isLoggedIn

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await productService.getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  const handleCartClick = () => {
    console.log('Cart clicked')
  }

  const handleWishlistClick = () => {
    console.log('Wishlist clicked')
  }

  const handleProfileMenuClick = () => {
    setShowProfile(true);
  }
  
  const handleProfileBackClick = () => {
    setShowProfile(false);
  }

  // If showing profile and logged in, display profile content
  if (showProfile && isLoggedIn) {
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
        onProfileMenuClick={handleProfileMenuClick}
      >
        <Profile onBackClick={handleProfileBackClick} />
      </Layout>
    );
  }

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
      onProfileMenuClick={handleProfileMenuClick}
    >
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-black mb-4">Chào mừng đến Fitness Mart</h1>
        <p className="text-gray-600 text-lg">Không có nỗ lực, không có thành công.</p>
      </div>
    </Layout>
  )
}

export default Main;