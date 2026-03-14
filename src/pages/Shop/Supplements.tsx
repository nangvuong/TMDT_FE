import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';

const SupplementsPage: React.FC = () => {
  usePageTitle('Thực Phẩm Bổ Sung | Fitness Mart');
  
  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Mock state for header
  const [wishlistCount] = useState(5);
  const cartCount = 3;
  const { isLoggedIn } = useIsLoggedIn();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryPage(page);
  };

  return (
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isUserLoggedIn={isLoggedIn}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-white py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thực Phẩm Bổ Sung
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các sản phẩm bổ sung dinh dưỡng hàng đầu giúp tối ưu hóa kết quả tập luyện
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Protein Powder</h3>
              <p className="text-gray-600">Bột protein từ whey, casein, và plant-based, giúp phục hồi cơ bắp</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">BCAA & Amino Acids</h3>
              <p className="text-gray-600">Axit amin branched-chain và amino acids toàn phương</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pre-Workout</h3>
              <p className="text-gray-600">Sản phẩm trước tập giúp tăng năng lượng và sự tập trung</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vitamin & Minerals</h3>
              <p className="text-gray-600">Vitamin và khoáng chất cần thiết cho sức khỏe tổng thể</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default SupplementsPage;
