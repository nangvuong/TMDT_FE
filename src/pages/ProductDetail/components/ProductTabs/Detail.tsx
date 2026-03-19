import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Package, Calendar } from 'lucide-react';
import type { Product } from '../../../../types/product';

interface DetailTabProps {
  product: Product;
}

/**
 * Detail Tab - Display product details and specifications
 */
const Detail: React.FC<DetailTabProps> = ({ product }) => {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Specifications */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2.5 sm:mb-4 flex items-center gap-2">
          <Package size={18} className="sm:w-5 sm:h-5" />
          Thông tin sản phẩm
        </h3>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {/* Product ID */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Mã sản phẩm</p>
              <p className="text-gray-900 font-semibold break-all text-sm sm:text-base">
                {product.id}
              </p>
            </div>

            {/* Category */}
            {product.categoryId && (
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Danh mục</p>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {product.categoryId}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Tình trạng</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    product.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {product.isActive ? 'Đang bán' : 'Không còn bán'}
                </p>
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Số lượng kho</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">{product.stock}</p>
            </div>

            {/* Created Date */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Ngày tạo</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">
                {formatDate(product.createdAt)}
              </p>
            </div>

            {/* Updated Date */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Cập nhật</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">
                {formatDate(product.updatedAt)}
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Đánh giá</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">
                {product.averageRating
                  ? `${parseFloat(product.averageRating.toString()).toFixed(1)}/5`
                  : 'Chưa có'}
              </p>
            </div>

            {/* Review Count */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Số đánh giá</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">{product.reviewCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2.5 sm:mb-4 flex items-center gap-2">
            <Tag size={18} className="sm:w-5 sm:h-5" />
            Thẻ sản phẩm
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <motion.span
                key={index}
                className="px-2.5 sm:px-4 py-1 sm:py-2 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2.5 sm:mb-3 flex items-center gap-2">
          <Calendar size={16} />
          Lịch sử
        </h3>
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Tạo:</span>{' '}
            {new Date(product.createdAt).toLocaleString('vi-VN')}
          </p>
          <p>
            <span className="font-medium">Cập nhật:</span>{' '}
            {new Date(product.updatedAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Detail;
