import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight, Search, X, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductList from '../../components/product/ProductList';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { useProducts, useCategories } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import Modal from '../../components/common/Modal/Modal';

/**
 * Product Page - Display all products with advanced filtering and search
 */
const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  usePageTitle('Product | Fitness Mart');
  useScrollReset([]);

  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Fetch products with filters
  const {
    products,
    isLoading: isProductsLoading,
    filterByPrice,
    filterByCategory,
    sortBy: sortProducts,
    refresh: refreshProducts,
  } = useProducts({
    page: 1,
    limit: 12,
    search: initialSearch,
  });

  // Local state for UI
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const productsGridRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  // Mock state for header
  const [wishlistCount] = useState(5);
  const cartCount = 3;
  const isUserLoggedIn = false;

  // Pagination logic
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSortChange = (order: 'featured' | 'price-low' | 'price-high' | 'newest') => {
    setSortOrder(order);
    // Apply sorting based on currentParams
    switch (order) {
      case 'price-low':
        sortProducts('price_asc');
        break;
      case 'price-high':
        sortProducts('price_desc');
        break;
      case 'newest':
        sortProducts('newest');
        break;
      case 'featured':
      default:
        sortProducts('newest');
        break;
    }
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    filterByPrice(min, max);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
    if (selectedCategory === categoryId) {
      // Remove filter
      setCurrentPage(1);
    } else {
      filterByCategory(categoryId);
      setCurrentPage(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      productsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      productsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Header */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {initialSearch ? (
              <div className="space-y-6">
                {/* Search Header with Icon */}
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 bg-gray-900 rounded-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <Search className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h1
                      className="text-4xl md:text-4xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Kết quả tìm kiếm
                    </motion.h1>
                    <motion.div
                      className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Search Details and Clear Button */}
                <div className="flex items-center justify-between gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-gray-600 text-sm font-medium mb-1">Từ khóa</p>
                    <p className="text-gray-900 text-xl font-bold">"{initialSearch}"</p>
                  </motion.div>

                  {/* Clear Search Button */}
                  <motion.button
                    onClick={() => {
                      refreshProducts();
                      setCurrentPage(1);
                      navigate('/products');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all font-medium group whitespace-nowrap h-fit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Xóa
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* All Products Header */}
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <Filter className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h1
                      className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Tất Cả Sản Phẩm
                    </motion.h1>
                    <motion.div
                      className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </div>
                </div>
                <motion.p
                  className="text-gray-600 text-lg leading-relaxed max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Khám phá bộ sưu tập sản phẩm fitness toàn diện của chúng tôi. Từ thiết bị tập luyện chuyên nghiệp đến thực phẩm bổ sung và thời trang thể thao.
                </motion.p>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Sidebar Filters - Desktop Only */}
            <motion.div
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg space-y-6 sticky top-20">
                {/* Price Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Giá</h3>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceChange(parseInt(e.target.value) || 0, priceRange.max)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceChange(priceRange.min, parseInt(e.target.value) || 100000000)
                      }
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Danh Mục</h3>
                    <span className="text-xs text-gray-500">({categoryPagination.totalItems})</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <Checkbox
                        key={cat.id}
                        label={cat.name}
                        checked={selectedCategory === cat.id}
                        onChange={() => handleCategoryChange(cat.id)}
                        size="sm"
                      />
                    ))}
                  </div>
                  {categoryPagination.totalItems && categoryPagination.totalItems > (categoryPagination.limit || 6) && (
                    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setCategoryPage(Math.max(1, (categoryPagination.page || 1) - 1))}
                        disabled={(categoryPagination.page || 1) === 1}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Trước
                      </button>
                      <span className="text-xs text-gray-500">
                        Trang {categoryPagination.page || 1} / {categoryPagination.totalPages || 1}
                      </span>
                      <button
                        onClick={() => setCategoryPage((categoryPagination.page || 1) + 1)}
                        disabled={(categoryPagination.page || 1) >= (categoryPagination.totalPages || 1)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau →
                      </button>
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Đánh Giá</h3>
                  <Select
                    options={[
                      { value: 0, label: 'Tất cả' },
                      { value: 5, label: '5 sao' },
                      { value: 4, label: '4 sao' },
                      { value: 3, label: '3 sao' },
                      { value: 2, label: '2 sao' },
                      { value: 1, label: '1 sao' },
                    ]}
                    value={selectedRating}
                    onChange={(value) => setSelectedRating(value as number)}
                    placeholder="Chọn đánh giá"
                    inputSize="sm"
                  />
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 100000000 });
                    setSelectedCategory('');
                    setSelectedRating(0);
                    refreshProducts();
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Xóa Bộ Lọc
                </button>
              </div>
            </motion.div>

            {/* Mobile Filters Modal */}
            <Modal
              isOpen={filterOpen}
              title="Bộ Lọc"
              onClose={() => setFilterOpen(false)}
              size="lg"
              closeButton={true}
              closeOnBackdropClick={true}
              closeOnEscape={true}
            >
              <div className="space-y-6">
                {/* Price Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Giá</h3>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceChange(parseInt(e.target.value) || 0, priceRange.max)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceChange(priceRange.min, parseInt(e.target.value) || 100000000)
                      }
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Danh Mục</h3>
                    <span className="text-xs text-gray-500">({categoryPagination.totalItems})</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <Checkbox
                        key={cat.id}
                        label={cat.name}
                        checked={selectedCategory === cat.id}
                        onChange={() => handleCategoryChange(cat.id)}
                        size="sm"
                      />
                    ))}
                  </div>
                  {categoryPagination.totalItems && categoryPagination.totalItems > (categoryPagination.limit || 6) && (
                    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setCategoryPage(Math.max(1, (categoryPagination.page || 1) - 1))}
                        disabled={(categoryPagination.page || 1) === 1}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Trước
                      </button>
                      <span className="text-xs text-gray-500">
                        Trang {categoryPagination.page || 1} / {categoryPagination.totalPages || 1}
                      </span>
                      <button
                        onClick={() => setCategoryPage((categoryPagination.page || 1) + 1)}
                        disabled={(categoryPagination.page || 1) >= (categoryPagination.totalPages || 1)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau →
                      </button>
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Đánh Giá</h3>
                  <Select
                    options={[
                      { value: 0, label: 'Tất cả' },
                      { value: 5, label: '5 sao' },
                      { value: 4, label: '4 sao' },
                      { value: 3, label: '3 sao' },
                      { value: 2, label: '2 sao' },
                      { value: 1, label: '1 sao' },
                    ]}
                    value={selectedRating}
                    onChange={(value) => setSelectedRating(value as number)}
                    placeholder="Chọn đánh giá"
                    inputSize="sm"
                  />
                </div>

                {/* Clear Filters - Modal Footer */}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 100000000 });
                    setSelectedCategory('');
                    setSelectedRating(0);
                    refreshProducts();
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium mt-6"
                >
                  Xóa Bộ Lọc
                </button>
              </div>
            </Modal>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {/* Top Controls */}
              <motion.div
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Mobile Filter Button */}
                <motion.button
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter size={18} />
                  <span className="text-sm font-medium">Lọc</span>
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
                {!isProductsLoading && totalPages > 1 && (
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

                    <div className="hidden sm:flex gap-1">
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

              {/* Products Grid */}
              <motion.div
                ref={productsGridRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {isProductsLoading ? (
                  <ProductSkeleton count={12} />
                ) : paginatedProducts.length > 0 ? (
                  <ProductList
                    products={paginatedProducts}
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ) : null}
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductPage;
