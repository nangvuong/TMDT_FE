import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface OrderSkeletonProps {
  count?: number;
}

/**
 * Skeleton Loader for Order Items
 */
const OrderSkeleton: React.FC<OrderSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="flex-1">
              <SkeletonLoader height={14} width={150} borderRadius="4px" />
            </div>
            <div className="flex-1 text-center">
              <SkeletonLoader height={20} width={80} borderRadius="4px" />
            </div>
            <div className="flex-1 text-right">
              <SkeletonLoader height={14} width={120} borderRadius="4px" />
            </div>
          </div>

          {/* Order Items */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex gap-4 p-4">
                <div className="flex-shrink-0">
                  <SkeletonLoader height={60} width={60} borderRadius="4px" />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <SkeletonLoader height={14} width="100%" borderRadius="4px" />
                  <SkeletonLoader height={12} width={60} borderRadius="4px" />
                </div>
                <div className="flex-shrink-0 text-right">
                  <SkeletonLoader height={14} width={80} borderRadius="4px" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
            <div>
              <SkeletonLoader height={16} width={120} borderRadius="4px" />
            </div>
            <div>
              <SkeletonLoader height={40} width={100} borderRadius="6px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkeleton;
