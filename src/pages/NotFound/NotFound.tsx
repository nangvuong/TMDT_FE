import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button/Button';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';

/**
 * NotFound Page (404) - Display when page is not found
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  usePageTitle('404 - Trang không tìm thấy | Fitness Mart');

  const { categories, isLoading: isLoadingCategories, pagination, setPage: setCategoryPage } = useCategories({
    page: 1,
    limit: 6,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
    },
  };

  return (
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={0}
      wishlistCount={0}
      isUserLoggedIn={false}
      currentCategoryPage={pagination.page}
      itemsPerPage={pagination.limit}
      totalCategoryPages={pagination.totalPages}
      onCategoryPageChange={(page) => setCategoryPage(page)}
    >
      <section className="w-full bg-white py-16 md:py-24 lg:py-32 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 404 Number */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            >
              <h1 className="text-8xl md:text-9xl font-black text-gray-200">404</h1>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Trang không tìm thấy
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại. Có thể nó đã bị xóa, 
              di chuyển hoặc bạn nhập sai URL.
            </motion.p>

            {/* Icon */}
            <motion.div
              className="mb-12"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg
                className="w-24 h-24 md:w-32 md:h-32 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                size="lg"
              >
                ← Quay lại trang chủ
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
              >
                Đăng nhập
              </Button>
            </motion.div>

            {/* Suggestion */}
            <motion.div
              className="mt-16 pt-16 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bạn có muốn:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Khám phá sản phẩm mới
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Xem danh mục sản phẩm
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Liên hệ hỗ trợ
                  </button>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
