import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../../types/product';

interface DescriptionTabProps {
  product: Product;
}

/**
 * Description Tab - Display detailed product description
 */
const Description: React.FC<DescriptionTabProps> = ({ product }) => {
  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {product.description ? (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Mô tả sản phẩm</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Không có mô tả sản phẩm</p>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Nhãn sản phẩm</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Description;
