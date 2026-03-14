import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useProducts } from '../../../hooks/useProduct';
import ProductList from '../../../components/product/ProductList';
import ProductSkeleton from '../../../components/loading/ProductSkeleton';
import Button from '../../../components/common/Button/Button';

/**
 * Products Section - Display featured products with filtering and pagination
 */
const Products: React.FC = () => {
  const { 
    products, 
    isLoading, 
    pagination, 
    setPage,
    sortBy,
  } = useProducts({ 
    page: 1, 
    limit: 12,
  });

  const [sortOrder, setSortOrder] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Scroll to products grid when pagination changes (but not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (productsGridRef.current) {
      productsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pagination.page]);

  const handleSortChange = (order: 'featured' | 'price-low' | 'price-high' | 'newest') => {
    setSortOrder(order);
    
    switch (order) {
      case 'price-low':
        sortBy('price', 'asc');
        break;
      case 'price-high':
        sortBy('price', 'desc');
        break;
      case 'newest':
        sortBy('createdAt', 'desc');
        break;
      case 'featured':
      default:
        sortBy('createdAt', 'desc');
        break;
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPage(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.total / pagination.limit) {
      setPage(pagination.page + 1);
    }
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
    // TODO: Navigate to product detail page
  };

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId);
    // TODO: Implement add to cart functionality
  };

  const handleAddToWishlist = (productId: string) => {
    console.log('Added to wishlist:', productId);
    // TODO: Implement add to wishlist functionality
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            Các sản phẩm được yêu thích nhất và sắp ra mắt
          </p>
          <div className="w-12 h-1 bg-black mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Filter & Sort Controls */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Filter Button (Mobile) */}
          <motion.button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Lọc & Sắp xếp</span>
          </motion.button>

          {/* Desktop Sort Controls */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Sắp xếp:</span>
            <div className="flex gap-2">
              {[
                { label: 'Nổi bật', value: 'featured' as const },
                { label: 'Giá thấp', value: 'price-low' as const },
                { label: 'Giá cao', value: 'price-high' as const },
                { label: 'Mới nhất', value: 'newest' as const },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-2 text-xs md:text-sm rounded-lg font-medium transition-all ${
                    sortOrder === option.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Page Numbers */}
          {!isLoading && pagination.total > pagination.limit && (
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <motion.button
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </motion.button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }).map((_, index) => {
                  const totalPages = Math.ceil(pagination.total / pagination.limit);
                  const pageNum = totalPages > 5 
                    ? Math.max(1, pagination.page - 2) + index
                    : index + 1;
                  
                  if (pageNum > totalPages) return null;

                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                className="p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={16} className="text-gray-700" />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Mobile Sort Controls */}
        {filterOpen && (
          <motion.div
            className="md:hidden grid grid-cols-2 gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              { label: 'Nổi bật', value: 'featured' as const },
              { label: 'Giá thấp', value: 'price-low' as const },
              { label: 'Giá cao', value: 'price-high' as const },
              { label: 'Mới nhất', value: 'newest' as const },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  handleSortChange(option.value);
                  setFilterOpen(false);
                }}
                className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                  sortOrder === option.value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Mobile Pagination Controls */}
        {!isLoading && pagination.total > pagination.limit && (
          <motion.div
            className="flex md:hidden items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={16} className="text-gray-700" />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }).map((_, index) => {
                const totalPages = Math.ceil(pagination.total / pagination.limit);
                const pageNum = totalPages > 5 
                  ? Math.max(1, pagination.page - 2) + index
                  : index + 1;
                
                if (pageNum > totalPages) return null;

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={handleNextPage}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={16} className="text-gray-700" />
            </motion.button>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          ref={productsGridRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {isLoading ? (
            <ProductSkeleton count={12} />
          ) : (
            <ProductList
              products={products}
              isLoading={false}
              isEmpty={products.length === 0}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          )}
        </motion.div>

        {/* View All Button */}
        {pagination.total > pagination.limit && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => console.log('Navigate to all products')}
            >
              Xem tất cả sản phẩm
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Products;
