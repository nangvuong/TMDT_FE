import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';

const SalePage: React.FC = () => {
  usePageTitle('Giảm Giá | Fitness Mart');
  
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
              Sản Phẩm Giảm Giá
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các sản phẩm được giảm giá lên đến 50% từ các thương hiệu hàng đầu
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-lg mb-12 border-2 border-red-200"
          >
            <h3 className="text-2xl font-bold text-red-600 mb-4">Flash Sale Hôm Nay</h3>
            <p className="text-gray-700 text-lg mb-6">
              Giảm giá đến 50% cho các sản phẩm được chọn. Cơ hội có hạn!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Loại sản phẩm</p>
                <p className="text-xl font-bold text-gray-900">Thiết Bị Gym</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Loại sản phẩm</p>
                <p className="text-xl font-bold text-gray-900">Protein Powder</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Loại sản phẩm</p>
                <p className="text-xl font-bold text-gray-900">Quần Áo Thể Thao</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Khuyến Mãi Theo Mùa</h3>
              <p className="text-gray-600">Những đợt giảm giá đặc biệt trong các dịp lễ tết và sự kiện đặc biệt</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sản Phẩm Tồn Kho</h3>
              <p className="text-gray-600">Giảm giá cho các sản phẩm tồn kho để nhường chỗ cho hàng mới</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deal Hàng Ngày</h3>
              <p className="text-gray-600">Những deal đặc biệt thay đổi hàng ngày với giá rất tốt</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bundle Deals</h3>
              <p className="text-gray-600">Mua bundle sản phẩm liên quan nhận giảm giá thêm</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default SalePage;
