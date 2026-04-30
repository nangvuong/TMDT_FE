import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductList from './ProductList';
import Button from '../common/Button/Button';
import { useProductRecommendation } from '../../hooks/useProduct';

export interface RecommendedProductsProps {
  productId: string;
  limit?: number;
  initialLimit?: number;
  onProductClick?: (productId: string) => void;
}

const MAX_LIMIT = 20;

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  productId,
  initialLimit = 8,
  onProductClick,
}) => {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);
  const { similarProducts, isLoading, error } = useProductRecommendation(productId, displayLimit);

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

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  // Only show the component if there's no validation error (limit exceeded)
  const isLimitExceededError = error && error.response?.status === 422 && 
    Array.isArray((error.response?.data as any)?.detail) &&
    (error.response?.data as any).detail.some?.((detail: any) => detail.type === 'less_than_equal');

  if (isLimitExceededError) {
    // Keep showing the products at the previous limit, hide load more button
    return (
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Bạn có thể thích
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg">
              Khám phá những sản phẩm bạn có thể quan tâm
            </p>
            <div className="w-12 h-1 bg-black dark:bg-white mx-auto mt-4 rounded-full" />
          </motion.div>

          {/* Products Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <ProductList
              products={similarProducts}
              isLoading={false}
              isEmpty={false}
              onProductClick={onProductClick}
            />
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  const handleLoadMore = () => {
    const newLimit = Math.min(displayLimit + 8, MAX_LIMIT);
    setDisplayLimit(newLimit);
  };

  const hasMoreProducts = (similarProducts?.length || 0) >= displayLimit && displayLimit < MAX_LIMIT;

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 md:py-16 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bạn có thể thích
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg">
            Khám phá những sản phẩm bạn có thể quan tâm
          </p>
          <div className="w-12 h-1 bg-black dark:bg-white mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <ProductList
            products={similarProducts}
            isLoading={isLoading}
            isEmpty={false}
            onProductClick={onProductClick}
          />
        </motion.div>

        {/* Load More Button */}
        {hasMoreProducts && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;
