import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Truck, Package, X, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../common/Button';
import { ORDER_STATUS } from '../../constants/api';
import type { Order } from '../../types/product';

interface OrderCardProps {
  order: Order;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  [ORDER_STATUS.PENDING]: { label: 'Chờ xử lý', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: <Clock className="w-4 h-4" /> },
  [ORDER_STATUS.CONFIRMED]: { label: 'Đã xác nhận', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: <CheckCircle className="w-4 h-4" /> },
  [ORDER_STATUS.PROCESSING]: { label: 'Đang xử lý', color: 'text-cyan-600', bgColor: 'bg-cyan-50', icon: <Package className="w-4 h-4" /> },
  [ORDER_STATUS.DELIVERED]: { label: 'Đã giao', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <Truck className="w-4 h-4" /> },
  [ORDER_STATUS.CANCELLED]: { label: 'Đã hủy', color: 'text-rose-600', bgColor: 'bg-rose-50', icon: <X className="w-4 h-4" /> },
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[order.status] || statusConfig.PROCESSING;
  const itemCount = order.items?.length || 0;
  const createdDate = new Date(order.createdAt).toLocaleDateString('vi-VN');

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Order Header */}
      <div className="border-b border-gray-100">
        {/* Mobile Layout */}
        <div className="md:hidden px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            {/* Left Column */}
            <div className="flex-1 space-y-1.5">
              {/* Row 1: Order ID */}
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500">Mã đơn hàng:</p>
                <p className="font-semibold text-xs text-gray-900 truncate">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>

              {/* Row 2: Date */}
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-600">Ngày đặt:</p>
                <p className="text-xs font-semibold text-gray-900 truncate">{createdDate}</p>
              </div>
            </div>

            {/* Right Column: Status Badge + Expand Button */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                {status.icon}
                <span className="hidden xs:inline truncate">{status.label}</span>
              </span>

              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                title="Xem chi tiết sản phẩm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-4 p-6">
          {/* Order ID */}
          <div className="flex-1">
            <p className="text-sm text-gray-600">Mã đơn hàng</p>
            <p className="font-semibold text-base text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          
          {/* Status Badge */}
          <div className="flex-1 text-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
              {status.icon}
              <span>{status.label}</span>
            </span>
          </div>
          
          {/* Date & Expand Button */}
          <div className="flex items-center justify-end gap-4 flex-1">
            <div className="text-right">
              <p className="text-sm text-gray-600">Ngày đặt</p>
              <p className="font-semibold text-base text-gray-900">{createdDate}</p>
            </div>
            
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900 flex-shrink-0"
              title="Xem chi tiết sản phẩm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Order Items Detail */}
      <AnimatePresence>
        {isExpanded && order.items && order.items.length > 0 && (
          <motion.div
            className="px-3 md:px-6 py-2.5 md:py-4 bg-gray-50 border-b border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Sản phẩm trong đơn hàng</h4>
            <motion.div 
              className="space-y-1.5 md:space-y-3"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {order.items.map((item, index) => {
                const subtotal = item.priceAtPurchase * item.quantity;
                return (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-lg border border-gray-100 p-1.5 md:p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/products/${item.productId}`)}
                    variants={{
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
                    }}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-1.5">
                      {/* Product Image & Name */}
                      <div className="flex gap-2">
                        {item.product?.images && item.product.images[0] && (
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.product?.name || `Sản phẩm #${item.productId.slice(0, 8)}`}
                          </p>
                        </div>
                      </div>

                      {/* Quantity, Unit Price, Total Price */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-0.5">Số lượng</p>
                          <p className="font-semibold text-gray-900">{item.quantity}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-0.5">Đơn giá</p>
                          <p className="text-xs font-semibold text-gray-900">{formatPrice(item.priceAtPurchase)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs mb-0.5">Thành tiền</p>
                          <p className="text-xs font-bold text-gray-900">{formatPrice(subtotal)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                      {/* Product Image */}
                      {item.product?.images && item.product.images[0] && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {item.product?.name || `Sản phẩm #${item.productId.slice(0, 8)}`}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex-shrink-0 text-center">
                        <p className="text-xs text-gray-500 mb-1">Số lượng</p>
                        <p className="font-semibold text-gray-900">{item.quantity}</p>
                      </div>

                      {/* Unit Price */}
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <p className="text-xs text-gray-500 mb-1">Đơn giá</p>
                        <p className="font-semibold text-gray-900">{formatPrice(item.priceAtPurchase)}</p>
                      </div>

                      {/* Subtotal */}
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <p className="text-xs text-gray-500 mb-1">Thành tiền</p>
                        <p className="font-bold text-gray-900">{formatPrice(subtotal)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Items Summary */}
      <div className="px-3 md:px-6 py-2.5 md:py-4 bg-gray-50">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-600">
              {itemCount} sản phẩm
            </p>
            <p className="text-xs font-semibold text-gray-900">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
          {order.discountAmount && order.discountAmount > 0 && (
            <p className="text-xs text-gray-600 text-right">
              -{formatPrice(order.discountAmount)} (Giảm giá)
            </p>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-col md:sm:flex-row md:sm:justify-between md:sm:items-center md:gap-3">
          <div>
            <p className="text-sm text-gray-600">
              {itemCount} sản phẩm
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tổng cộng</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(order.totalAmount)}
            </p>
            {order.discountAmount && order.discountAmount > 0 && (
              <p className="text-sm text-gray-600">
                -{formatPrice(order.discountAmount)} (Giảm giá)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Footer */}
      <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6">
        {order.shippingAddress && (
          <div className="text-xs md:text-sm text-gray-600 flex-1">
            <p className="font-medium text-gray-900 mb-1">Địa chỉ giao hàng</p>
            <p className="line-clamp-2">{order.shippingAddress}</p>
          </div>
        )}
        
        <Button 
          onClick={() => navigate(`/orders/${order.id}`)}
          size="sm" 
          className="w-full md:w-auto md:flex-shrink-0"
        >
          Chi tiết
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderCard;
