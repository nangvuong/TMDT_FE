import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, Truck, Package, X, MapPin } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { useOrders } from '../../hooks/useOrders';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS } from '../../constants/api';
import type { Order, OrderStatus } from '../../types/product';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; darkBgColor: string; icon: React.ReactNode; step: number }> = {
  [ORDER_STATUS.PENDING]: { label: 'Chờ xử lý', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50', darkBgColor: 'dark:bg-amber-900/30', icon: <Clock className="w-5 h-5" />, step: 1 },
  [ORDER_STATUS.CONFIRMED]: { label: 'Đã xác nhận', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-900/30', icon: <CheckCircle className="w-5 h-5" />, step: 2 },
  [ORDER_STATUS.PROCESSING]: { label: 'Đang xử lý', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50', darkBgColor: 'dark:bg-cyan-900/30', icon: <Package className="w-5 h-5" />, step: 3 },
  [ORDER_STATUS.DELIVERED]: { label: 'Đã giao', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50', darkBgColor: 'dark:bg-emerald-900/30', icon: <Truck className="w-5 h-5" />, step: 4 },
  [ORDER_STATUS.CANCELLED]: { label: 'Đã hủy', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50', darkBgColor: 'dark:bg-rose-900/30', icon: <X className="w-5 h-5" />, step: 0 },
};

const timelineSteps = [
  { step: 1, label: 'Chờ xử lý', icon: Clock },
  { step: 2, label: 'Đã xác nhận', icon: CheckCircle },
  { step: 3, label: 'Đang xử lý', icon: Package },
  { step: 4, label: 'Đã giao', icon: Truck },
];

const Detail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  usePageTitle('Chi tiết đơn hàng | Fitness Mart');
  useScrollReset();

  const { getOrderById, loading, error } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-16 min-h-screen">
          <div className="container mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-16 min-h-screen">
          <div className="container mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-6 sm:mb-8 group"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </motion.button>
            <motion.div 
              className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-red-600 dark:text-red-400 font-semibold">{error || 'Không tìm thấy đơn hàng'}</p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const orderStatus = statusConfig[order.status] || statusConfig[ORDER_STATUS.PENDING];
  const createdDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
  const isCancelled = order.status === ORDER_STATUS.CANCELLED;

  // Action button logic
  const isPending = order.status === ORDER_STATUS.PENDING;
  const canCancel = [ORDER_STATUS.PENDING as OrderStatus, ORDER_STATUS.CONFIRMED as OrderStatus, ORDER_STATUS.PROCESSING as OrderStatus].includes(order.status);
  const canUpdate = [ORDER_STATUS.PENDING as OrderStatus, ORDER_STATUS.CONFIRMED as OrderStatus].includes(order.status);
  const canRepurchase = [ORDER_STATUS.DELIVERED as OrderStatus, ORDER_STATUS.CANCELLED as OrderStatus].includes(order.status);

  const handlePayment = () => {
    navigate('/payment', {
      state: {
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: 'bank_transfer'
      }
    });
  };

  const handleCancel = () => {
    // TODO: Implement cancel order logic
    console.log('Cancel order:', order.id);
  };

  const handleUpdate = () => {
    // TODO: Implement update order logic
    console.log('Update order:', order.id);
  };

  const handleRepurchase = () => {
    // TODO: Implement repurchase logic
    console.log('Repurchase order:', order.id);
  };

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-16 min-h-screen">
        <div className="container mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-6 sm:mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Order Header */}
          <motion.div
            className="mb-6 md:mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Mobile Layout */}
            <div className="md:hidden px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                {/* Left Column */}
                <div className="flex-1 space-y-2">
                  {/* Row 1: Order ID */}
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mã đơn:</p>
                    <p className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>

                  {/* Row 2: Date */}
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ngày:</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{createdDate}</p>
                  </div>
                </div>

                {/* Right Column: Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${orderStatus.bgColor} ${orderStatus.darkBgColor} ${orderStatus.color}`}>
                    {orderStatus.icon}
                    <span className="hidden xs:inline truncate">{orderStatus.label}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center md:justify-between md:gap-6 p-6">
              {/* Order ID */}
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng</p>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{order.id.slice(0, 12).toUpperCase()}</p>
              </div>
              
              {/* Status Badge */}
              <div className="flex-1 text-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${orderStatus.bgColor} ${orderStatus.darkBgColor} ${orderStatus.color}`}>
                  {orderStatus.icon}
                  <span>{orderStatus.label}</span>
                </span>
              </div>
              
              {/* Date */}
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Ngày đặt hàng</p>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{createdDate}</p>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <motion.div
              className="mb-4 md:mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-4 md:p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2 className="text-sm md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                Địa chỉ giao hàng
              </h2>
                <p className="text-sm md:text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
                  {order.shippingAddress}
                </p>
            </motion.div>
          )}

          {/* Timeline */}
          {!isCancelled && (
            <motion.div
              className="mb-6 md:mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-3 md:p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-base md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 md:mb-8">Quá trình xử lý đơn hàng</h2>
              
              {/* Horizontal Timeline */}
              <div className="relative py-2 md:py-4">
                {/* Timeline line */}
                <div className="absolute top-4 md:top-6 left-3 right-3 md:left-6 md:right-6 h-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Timeline steps */}
                <div className="relative flex justify-between items-start">
                  {timelineSteps.map((timelineStep) => {
                    const isCompleted = orderStatus.step >= timelineStep.step;
                    const IconComponent = timelineStep.icon;

                    return (
                      <motion.div
                        key={timelineStep.step}
                        className="flex flex-col items-center flex-1 px-0.5 md:px-0"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: timelineStep.step * 0.1 }}
                      >
                        {/* Timeline dot */}
                        <div
                          className={`relative z-10 w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all mb-2 md:mb-4 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900'
                              : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 md:w-6 md:h-6" />
                        </div>

                        {/* Timeline content */}
                        <div className="text-center">
                          <p className={`font-semibold text-xs md:text-sm leading-tight ${isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {timelineStep.label}
                          </p>
                          {isCompleted && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1">
                              {orderStatus.step === timelineStep.step ? 'Hiện tại' : 'Hoàn thành'}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Items */}
          <motion.div
            className="mb-6 md:mb-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                Sản phẩm ({order.items?.length || 0})
              </h2>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items?.map((item, index) => {
                const subtotal = item.priceAtPurchase * item.quantity;
                return (
                  <motion.div
                    key={index}
                    className="p-3 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => navigate(`/products/${item.productId}`)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-1.5">
                      {/* Product Image & Name */}
                      <div className="flex gap-2">
                        {item.product?.images && item.product.images[0] && (
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {item.product?.name || `Sản phẩm #${item.productId.slice(0, 8)}`}
                          </p>
                        </div>
                      </div>

                      {/* Quantity, Unit Price, Total Price */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <div className="text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Số lượng</p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{item.quantity}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Đơn giá</p>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{formatPrice(item.priceAtPurchase)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">Thành tiền</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                      {/* Product Image */}
                      {item.product?.images && item.product.images[0] && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {item.product?.name || `Sản phẩm #${item.productId.slice(0, 8)}`}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex-shrink-0 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số lượng</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.quantity}</p>
                      </div>

                      {/* Unit Price */}
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đơn giá</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(item.priceAtPurchase)}</p>
                      </div>

                      {/* Subtotal */}
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Thành tiền</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(subtotal)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {/* Order Summary Section */}
              <div className="border-t border-gray-100 dark:border-gray-800 p-4 md:p-6">

                <div className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Tạm tính ({order.items?.length || 0} sản phẩm)
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPrice((Number(order.totalAmount) || 0) + (Number(order.discountAmount) || 0))}
                    </p>
                  </div>

                  {order.discountAmount && order.discountAmount > 0 && (
                    <motion.div
                      className="flex justify-between text-sm bg-emerald-50 dark:bg-emerald-900/30 -mx-2 px-2 py-2 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-emerald-700 dark:text-emerald-400">Khuyến mãi</p>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400">-{formatPrice(order.discountAmount)}</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-base md:text-lg">Tổng cộng</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {/* Payment Button - Show for pending orders */}
            {isPending && (
              <Button
                onClick={handlePayment}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto sm:flex-1"
              >
                Thanh toán
              </Button>
            )}

            {/* Cancel Button - Show if order can be cancelled */}
            {canCancel && (
              <Button
                onClick={handleCancel}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:flex-1"
              >
                Hủy đơn hàng
              </Button>
            )}

            {/* Update Button - Show if order can be updated */}
            {canUpdate && (
              <Button
                onClick={handleUpdate}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:flex-1"
              >
                Cập nhật đơn hàng
              </Button>
            )}

            {/* Repurchase Button - Show for delivered or cancelled orders */}
            {canRepurchase && (
              <Button
                onClick={handleRepurchase}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto sm:flex-1"
              >
                Mua lại
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Detail;
