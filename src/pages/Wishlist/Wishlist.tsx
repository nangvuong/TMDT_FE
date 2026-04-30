import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import ProductList from '../../components/product/ProductList';
import RecommendedProducts from '../../components/product/RecommendedProducts';
import { useWishlist } from '../../hooks/useWishlist';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { useScrollReset } from '../../hooks/useScrollReset';
import { usePageTitle } from '../../hooks/usePageTitle';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsLoggedIn();
  const { items, isLoading, error, pagination, setPage, refresh } = useWishlist();

  // Reset scroll position and update page title
  useScrollReset();
  usePageTitle('Whislist | Fitness Mart');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16 min-h-screen">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-6 sm:mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Header */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Heart className="w-6 h-6 text-white dark:text-gray-900" />
              </motion.div>
              <div className="flex-1">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Danh Sách Yêu Thích
                </motion.h1>
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 dark:from-gray-100 dark:to-gray-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </div>
            </div>
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-3xl mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bạn có <span className="font-semibold">{pagination.total}</span> sản phẩm trong danh sách yêu thích
            </motion.p>
          </motion.div>

          {/* Loading skeleton */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Heart className="w-6 h-6 text-white dark:text-gray-900" />
              </motion.div>
              <div className="flex-1">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Danh Sách Yêu Thích
                </motion.h1>
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 dark:from-gray-100 dark:to-gray-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </div>
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md dark:shadow-gray-900/30 h-96"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mt-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16 min-h-screen">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-8 group"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </motion.button>

            <motion.div
              className="mb-12 md:mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Heart className="w-6 h-6 text-white dark:text-gray-900" />
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Danh Sách Yêu Thích
                  </motion.h1>
                  <motion.div
                    className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 dark:from-gray-100 dark:to-gray-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Empty state */}
            <motion.div
              className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-900/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Danh sách yêu thích của bạn trống
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Thêm sản phẩm vào danh sách yêu thích để lưu giữ chúng
              </p>
              <Button
                onClick={() => navigate('/products')}
                size="md"
                className="bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                Khám Phá Sản Phẩm
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16 min-h-screen">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-8 group"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </motion.button>

            <motion.div
              className="mb-12 md:mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Heart className="w-6 h-6 text-white dark:text-gray-900" />
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Danh Sách Yêu Thích
                  </motion.h1>
                  <motion.div
                    className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 dark:from-gray-100 dark:to-gray-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Error state */}
            <motion.div
              className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-900/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-red-500 dark:text-red-400 mb-4">
                <svg
                  className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Có lỗi xảy ra
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                {error}
              </p>
              <Button
                onClick={refresh}
                size="md"
                className="bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                Thử Lại
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-16 min-h-screen">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Header */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Heart className="w-6 h-6 text-white dark:text-gray-900" />
              </motion.div>
              <div className="flex-1">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Danh Sách Yêu Thích
                </motion.h1>
                <motion.div
                  className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 dark:from-gray-100 dark:to-gray-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </div>
            </div>
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bạn có <span className="font-semibold">{items.length}</span> sản phẩm trong danh sách yêu thích
            </motion.p>
          </motion.div>

          {/* Wishlist Items Grid */}
          <div className="mb-8">
            <ProductList
              products={items.map((item) => item.product)}
              isLoading={isLoading}
              isEmpty={items.length === 0}
              onProductClick={handleProductClick}
            />
          </div>

          {/* Pagination */}
          {pagination.totalPage > 1 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {Array.from({ length: pagination.totalPage }).map((_, i) => (
                <motion.button
                  key={i + 1}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    pagination.page === i + 1
                      ? 'bg-black dark:bg-white text-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
        {/* Recommended Products - Based on first wishlist item */}
        {items.length > 0 && (<div className="mb-8">
            <RecommendedProducts
              productId={items[0].product.id}
              limit={8}
              onProductClick={handleProductClick}
            />
          </div>
        )}
      </section>
      
    </Layout>
  );
};

export default Wishlist;
