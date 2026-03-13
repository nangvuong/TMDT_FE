import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface ProductSkeletonProps {
  count?: number;
}

/**
 * Skeleton Loader for Product Cards
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden p-4 space-y-4">
          {/* Product Image */}
          <SkeletonLoader height={200} borderRadius="8px" />

          {/* Product Info */}
          <div className="space-y-3 pt-2">
            {/* Category Label */}
            <SkeletonLoader height={16} width={60} borderRadius="4px" />

            {/* Product Name */}
            <SkeletonLoader height={18} count={2} borderRadius="4px" />

            {/* Price Section */}
            <div className="flex gap-3">
              <SkeletonLoader height={20} width={80} borderRadius="4px" />
              <SkeletonLoader height={16} width={60} borderRadius="4px" />
            </div>

            {/* Rating */}
            <SkeletonLoader height={14} width={100} borderRadius="4px" />

            {/* Add to Cart Button */}
            <SkeletonLoader height={40} borderRadius="6px" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
