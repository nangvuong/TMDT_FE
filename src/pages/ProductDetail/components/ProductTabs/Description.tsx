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
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {product.description ? (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h3>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có mô tả sản phẩm</p>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Nhãn sản phẩm</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
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
