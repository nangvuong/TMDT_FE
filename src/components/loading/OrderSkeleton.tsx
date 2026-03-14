import React from 'react';
import { motion } from 'framer-motion';
import SkeletonLoader from './SkeletonLoader';

interface OrderSkeletonProps {
  count?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

/**
 * Skeleton Loader for Order Items
 */
const OrderSkeleton: React.FC<OrderSkeletonProps> = ({ count = 3 }) => {
  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          variants={itemVariants}
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-6 border-b border-gray-100">
            <div className="flex-1 w-full md:w-auto">
              <SkeletonLoader height={14} width={150} borderRadius="4px" />
            </div>
            <div className="flex-1 w-full md:w-auto text-center">
              <SkeletonLoader height={20} width={80} borderRadius="6px" />
            </div>
            <div className="flex-1 w-full md:w-auto text-right">
              <SkeletonLoader height={14} width={120} borderRadius="4px" />
            </div>
          </div>

          {/* Order Items */}
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex gap-4 p-4 md:p-6">
                <div className="flex-shrink-0">
                  <SkeletonLoader height={80} width={80} borderRadius="8px" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <SkeletonLoader height={14} width="100%" borderRadius="4px" />
                  <SkeletonLoader height={12} width={60} borderRadius="4px" />
                  <SkeletonLoader height={12} width={80} borderRadius="4px" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 bg-gray-50 border-t border-gray-100">
            <div>
              <SkeletonLoader height={16} width={120} borderRadius="4px" />
            </div>
            <div>
              <SkeletonLoader height={40} width={120} borderRadius="8px" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OrderSkeleton;
