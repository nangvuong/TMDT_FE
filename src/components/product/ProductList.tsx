import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading = false,
  isEmpty = false,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
}) => {
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`skeleton-${i}`}
            className="bg-white rounded-lg overflow-hidden shadow-md h-96"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-48 bg-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-6 bg-gray-300 rounded w-1/3 mt-4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Empty state
  if (isEmpty || products.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 md:py-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          Không có sản phẩm
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          Hãy thử tìm kiếm hoặc điều chỉnh bộ lọc của bạn
        </p>
      </motion.div>
    );
  }

  // Products grid
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.images?.[0]}
            tags={product.tags}
            stock={product.stock}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
            onClick={() => onProductClick?.(product.id)}
            onAddToCart={() => onAddToCart?.(product.id)}
            onAddToWishlist={() => onAddToWishlist?.(product.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
