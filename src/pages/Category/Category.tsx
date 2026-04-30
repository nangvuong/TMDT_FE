import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductList from '../../components/product/ProductList';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { useCategory } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';

/**
 * Category Page - Display products from a specific category with filtering and pagination
 */
const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  if (!categoryId) {
    return <div>Category not found</div>;
  }

  // Reset scroll position to top when page mounts
  useScrollReset([categoryId]);

  // Fetch category details (includes products from API)
  const { category, isLoading: isCategoryLoading } = useCategory(categoryId);
  usePageTitle(`${category?.name || 'Category'} | Fitness Mart`);

  const [sortOrder, setSortOrder] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const productsGridRef = useRef<HTMLDivElement>(null);


  // Get products from category response or empty array
  const allProducts = category?.products || [];
  const isLoading = isCategoryLoading;

  // Sort products based on selected order
  const sortedProducts = [...allProducts].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;

    switch (sortOrder) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        return 0;
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSortChange = (order: 'featured' | 'price-low' | 'price-high' | 'newest') => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-4 md:py-8 lg:py-16">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium mb-6 sm:mb-8 group"
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
            className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isCategoryLoading ? (
              <div className="space-y-4">
                <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse" />
                <div className="h-16 sm:h-20 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Category Header with Icon */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <motion.div
                    className="p-3 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <Filter className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h1
                      className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {category?.name}
                    </motion.h1>
                    <motion.div
                      className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Category Description */}
                {category?.description && (
                  <motion.p
                    className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {category.description}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>

          {/* Filter & Sort Controls */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Mobile Filter Button */}
            <motion.button
              className="md:hidden flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} />
              <span className="font-medium">Lọc & Sắp xếp</span>
            </motion.button>

            {/* Desktop Sort Controls */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { label: 'Nổi bật', value: 'featured' as const },
                { label: 'Giá thấp', value: 'price-low' as const },
                { label: 'Giá cao', value: 'price-high' as const },
                { label: 'Mới nhất', value: 'newest' as const },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    sortOrder === option.value
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <motion.div
                className="flex md:hidden items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <div className="flex gap-1 flex-wrap justify-center max-w-xs">
                  {pageNumbers.map((page) => (
                    <motion.button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Sort Controls */}
          {filterOpen && (
            <motion.div
              className="md:hidden grid grid-cols-2 gap-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {[
                { label: 'Nổi bật', value: 'featured' as const },
                { label: 'Giá thấp', value: 'price-low' as const },
                { label: 'Giá cao', value: 'price-high' as const },
                { label: 'Mới nhất', value: 'newest' as const },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value);
                    setFilterOpen(false);
                  }}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    sortOrder === option.value
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Mobile Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <motion.div
              className="flex md:hidden items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              <div className="flex gap-1 flex-wrap justify-center max-w-xs">
                {pageNumbers.map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Products Grid */}
          <motion.div
            ref={productsGridRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <ProductSkeleton count={12} />
            ) : (
              <ProductList
                products={paginatedProducts}
                onProductClick={handleProductClick}
              />
            )}
          </motion.div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Trang trước
              </motion.button>

              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Trang {currentPage} / {totalPages}
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-black dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Trang sau →
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
