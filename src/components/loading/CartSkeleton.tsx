import React from 'react';
import { motion } from 'framer-motion';
import SkeletonLoader from './SkeletonLoader';

interface CartSkeletonProps {
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
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

/**
 * Skeleton Loader for Cart Items
 */
const CartSkeleton: React.FC<CartSkeletonProps> = ({ count = 3 }) => {
  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Cart Items */}
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
          variants={itemVariants}
        >
          {/* Item Image */}
          <div className="flex-shrink-0 h-24 sm:h-28 w-full sm:w-28">
            <SkeletonLoader height="100%" width="100%" borderRadius="8px" />
          </div>

          {/* Item Details */}
          <div className="flex-1 space-y-3">
            <SkeletonLoader height={16} width="80%" borderRadius="4px" />
            <SkeletonLoader height={14} width={100} borderRadius="4px" />
          </div>

          {/* Quantity & Total */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SkeletonLoader height={32} width={100} borderRadius="6px" />
            <SkeletonLoader height={18} width={80} borderRadius="4px" />
            <SkeletonLoader height={36} width={36} borderRadius="6px" />
          </div>
        </motion.div>
      ))}

      {/* Cart Summary */}
      <motion.div
        className="bg-gray-50 rounded-lg p-6 space-y-4 mt-6 border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center">
          <SkeletonLoader height={18} width={150} borderRadius="4px" />
          <SkeletonLoader height={20} width={120} borderRadius="4px" />
        </div>
        <SkeletonLoader height={48} borderRadius="8px" />
      </motion.div>
    </motion.div>
  );
};

export default CartSkeleton;
