import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductList from '../../components/product/ProductList';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { useCategories, useCategory } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';

/**
 * Category Page - Display products from a specific category with filtering and pagination
 */
const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  if (!categoryId) {
    return <div>Category not found</div>;
  }

  // Reset scroll position to top when page mounts
  useScrollReset([categoryId]);

  // Fetch category details (includes products from API)
  const { category, isLoading: isCategoryLoading } = useCategory(categoryId);
  usePageTitle(`${category?.name || 'Category'} | Fitness Mart`);

  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  const [sortOrder, setSortOrder] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const productsGridRef = useRef<HTMLDivElement>(null);

  // Mock state for header
  const [wishlistCount] = useState(5);
  const cartCount = 3;
  const isUserLoggedIn = false;

  // Get products from category response or empty array
  const allProducts = category?.products || [];
  const isLoading = isCategoryLoading;

  // Sort products based on selected order
  const sortedProducts = [...allProducts].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;

    switch (sortOrder) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        return 0;
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSortChange = (order: 'featured' | 'price-low' | 'price-high' | 'newest') => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId);
  };

  const handleAddToWishlist = (productId: string) => {
    console.log('Added to wishlist:', productId);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryPage(page);
  };

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

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
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isUserLoggedIn={isUserLoggedIn}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-white py-8 md:py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            className="mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Quay lại
            </button>
            {isCategoryLoading ? (
              <>
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {category?.name}
                </h1>
                {category?.description && (
                  <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl">
                    {category.description}
                  </p>
                )}
              </>
            )}
          </motion.div>

          {/* Filter & Sort Controls */}
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Mobile Filter Button */}
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
              {[
                { label: 'Nổi bật', value: 'featured' as const },
                { label: 'Giá thấp', value: 'price-low' as const },
                { label: 'Giá cao', value: 'price-high' as const },
                { label: 'Mới nhất', value: 'newest' as const },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === option.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <div className="flex gap-1">
                  {pageNumbers.map((page) => (
                    <motion.button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === option.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700'
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
          {!isLoading && totalPages > 1 && (
            <motion.div
              className="flex md:hidden items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              <div className="flex gap-1 flex-wrap justify-center max-w-xs">
                {pageNumbers.map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Products Grid */}
          <motion.div
            ref={productsGridRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <ProductSkeleton count={12} />
            ) : (
              <ProductList
                products={paginatedProducts}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            )}
          </motion.div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Trang trước
              </motion.button>

              <div className="text-sm text-gray-600 font-medium">
                Trang {currentPage} / {totalPages}
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Trang sau →
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
