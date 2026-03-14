import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../../../hooks/useProduct';
import { SkeletonLoader } from '../../../components/loading';

/**
 * Category Section - Display product categories in a beautiful grid/carousel layout
 */
const Category: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, pagination, setPage } = useCategories({ 
    page: 1, 
    limit: 8,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate(`/categories/${categoryId}`);
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPage(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPage(pagination.page + 1);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Khám Phá Danh Mục
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            Tìm kiếm các sản phẩm phù hợp với nhu cầu của bạn
          </p>
          <div className="w-12 h-1 bg-black mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Categories Grid */}
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className="space-y-3 h-full flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <SkeletonLoader height={160} borderRadius="12px" />
                <div className="px-4 flex-1 flex flex-col justify-between">
                  <SkeletonLoader height={16} width="80%" borderRadius="4px" />
                  <SkeletonLoader height={40} width="100%" borderRadius="4px" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className="group cursor-pointer h-full"
                  variants={itemVariants}
                  onClick={() => handleCategorySelect(category.id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {/* Category Card */}
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="w-full h-40 md:h-48 overflow-hidden bg-gray-200 relative flex-shrink-0">
                      {category.imageUrl ? (
                        <motion.img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <motion.div
                          className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 flex items-center justify-center"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="text-gray-600 text-sm">No Image</span>
                        </motion.div>
                      )}

                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <motion.button
                          className="px-6 py-2 bg-white text-black font-semibold rounded-lg opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Xem sản phẩm
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2 flex-1">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {selectedCategoryId === category.id && (
                      <motion.div
                        className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-4 mt-8 md:mt-12"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={handlePrevPage}
                  disabled={pagination.page === 1}
                  className="p-2 md:p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, index) => {
                    const pageNum = pagination.totalPages > 5 
                      ? Math.max(1, pagination.page - 2) + index
                      : index + 1;
                    
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold text-sm transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 md:p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Category;
