import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface CartSkeletonProps {
  count?: number;
}

/**
 * Skeleton Loader for Cart Items
 */
const CartSkeleton: React.FC<CartSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {/* Cart Items */}
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 bg-white border-2 border-gray-200 rounded-lg p-4">
          {/* Item Image */}
          <div className="flex-shrink-0">
            <SkeletonLoader height={100} width={100} borderRadius="6px" />
          </div>

          {/* Item Details */}
          <div className="flex-1 space-y-2 min-w-0">
            <SkeletonLoader height={16} width="80%" borderRadius="4px" />
            <SkeletonLoader height={14} width={60} borderRadius="4px" />
          </div>

          {/* Quantity Controls */}
          <div className="flex-shrink-0">
            <SkeletonLoader height={32} width={80} borderRadius="4px" />
          </div>

          {/* Total Price */}
          <div className="flex-shrink-0 text-right">
            <SkeletonLoader height={16} width={80} borderRadius="4px" />
          </div>

          {/* Remove Button */}
          <div className="flex-shrink-0">
            <SkeletonLoader height={32} width={32} borderRadius="4px" />
          </div>
        </div>
      ))}

      {/* Cart Summary */}
      <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 space-y-3 mt-6">
        <SkeletonLoader height={20} width={150} borderRadius="4px" />
        <SkeletonLoader height={40} borderRadius="6px" />
      </div>
    </div>
  );
};

export default CartSkeleton;
