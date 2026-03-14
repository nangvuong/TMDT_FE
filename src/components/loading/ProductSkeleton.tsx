import React from 'react';
import { motion } from 'framer-motion';
import SkeletonLoader from './SkeletonLoader';

interface ProductSkeletonProps {
  count?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
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

/**
 * Skeleton Loader for Product Cards
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          variants={itemVariants}
        >
          {/* Product Image */}
          <div className="w-full h-36 sm:h-40 md:h-48 lg:h-56 bg-gray-100 overflow-hidden">
            <SkeletonLoader height="100%" borderRadius="0" />
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 md:p-4 lg:p-5 space-y-2 sm:space-y-3">
            {/* Tag */}
            <SkeletonLoader height={14} width={50} borderRadius="3px" />

            {/* Product Name */}
            <SkeletonLoader height={16} count={2} borderRadius="3px" />

            {/* Stock Info */}
            <SkeletonLoader height={12} width={80} borderRadius="3px" />

            {/* Price Section */}
            <SkeletonLoader height={18} width={100} borderRadius="3px" />

            {/* Add to Cart Button */}
            <SkeletonLoader height={32} borderRadius="6px" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductSkeleton;
