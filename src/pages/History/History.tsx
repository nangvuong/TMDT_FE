import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import OrderCard from '../../components/order/OrderCard';
import OrderSkeleton from '../../components/loading/OrderSkeleton';
import { LinkButton } from '../../components/common/Button';
import { useOrders } from '../../hooks/useOrders';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';

const History: React.FC = () => {
  const navigate = useNavigate();
  usePageTitle('My orders | Fitness Mart');
  useScrollReset();
  
  const { orders, total, currentPage, loading, error, fetchMyOrders } = useOrders();
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchMyOrders(1, limit);
  }, []);

  const handlePageChange = (page: number) => {
    fetchMyOrders(page, limit);
  };

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 lg:py-16">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-6 sm:mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Page Header */}
          <motion.div 
            className="mb-4 sm:mb-6 md:mb-8 flex items-start gap-2 sm:gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-2 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h1
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Đơn hàng của tôi
              </motion.h1>
              <motion.div
                className="h-0.5 w-12 bg-gradient-to-r from-gray-900 to-gray-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div 
              className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-100 border border-gray-300 rounded-lg text-xs md:text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-900">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && <OrderSkeleton count={3} />}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <motion.div 
              className="text-center py-12 md:py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div 
                className="flex justify-center mb-4 md:mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="p-3 md:p-4 bg-gray-200 rounded-full">
                  <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-900" />
                </div>
              </motion.div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Chưa có đơn hàng
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                Bạn chưa tạo bất kỳ đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <LinkButton href="/" size="lg">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                Tiếp tục mua sắm
              </LinkButton>
            </motion.div>
          )}

          {/* Orders List */}
          {!loading && orders.length > 0 && (
            <>
              <motion.div 
                className="space-y-3 md:space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                  >
                    ← Trước
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];
                    const maxPagesToShow = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                    if (endPage - startPage + 1 < maxPagesToShow) {
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return (
                      <>
                        {startPage > 1 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              disabled={loading}
                              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors text-sm md:text-base"
                            >
                              1
                            </button>
                            {startPage > 2 && <span className="text-gray-500 text-sm md:text-base">...</span>}
                          </>
                        )}

                        {pages.map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className={`px-3 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {endPage < totalPages && (
                          <>
                            {endPage < totalPages - 1 && <span className="text-gray-500 text-sm md:text-base">...</span>}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              disabled={loading}
                              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors text-sm md:text-base"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default History;
