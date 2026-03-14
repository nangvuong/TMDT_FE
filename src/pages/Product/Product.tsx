import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductList from '../../components/product/ProductList';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { useProducts, useCategories } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import Button from '../../components/common/Button/Button';
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
  const initialSearch = searchParams.get('q') || '';

  usePageTitle('Sản Phẩm | Fitness Mart');
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
    search: searchProducts,
    filterByPrice,
    filterByCategory,
    filterByTags,
    filterByStock,
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
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock tags data (in real app, would come from API)
  const mockTags = ['Cardio', 'Strength', 'Flexibility', 'Endurance', 'Recovery', 'Weight Loss', 'Muscle Gain', 'Balance'];

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

  const handleHeaderSearch = (query: string) => {
    searchProducts(query);
    setCurrentPage(1);
  };

  const handleSortChange = (order: 'featured' | 'price-low' | 'price-high' | 'newest') => {
    setSortOrder(order);
    // Apply sorting based on currentParams
    switch (order) {
      case 'price-low':
        sortProducts('price', 'asc');
        break;
      case 'price-high':
        sortProducts('price', 'desc');
        break;
      case 'newest':
        sortProducts('createdAt', 'desc');
        break;
      case 'featured':
      default:
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

  const handleStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    filterByStock(checked);
    setCurrentPage(1);
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    filterByTags(updatedTags.join(','));
    setCurrentPage(1);
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
      onSearch={handleHeaderSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-white py-8 md:py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {/* Header */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tất Cả Sản Phẩm
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Khám phá bộ sưu tập sản phẩm fitness toàn diện của chúng tôi
            </p>
          </motion.div>

          {/* Search Bar */}
          {initialSearch && (
            <motion.div
              className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>
                <p className="text-sm text-gray-600">
                  Kết quả tìm kiếm cho: <span className="font-semibold text-gray-900">"{initialSearch}"</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tìm thấy <span className="font-semibold text-blue-600">{products.length}</span> sản phẩm
                </p>
              </div>
              <motion.button
                onClick={() => {
                  refreshProducts();
                  setCurrentPage(1);
                  navigate('/products');
                }}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xóa
              </motion.button>
            </motion.div>
          )}

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

                {/* Tag Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Thẻ</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedTags([]);
                        filterByTags('');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa thẻ
                    </button>
                  )}
                </div>

                {/* Stock Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Tồn Kho</h3>
                  <Checkbox
                    label="Chỉ hiển thị hàng có sẵn"
                    checked={inStockOnly}
                    onChange={(e) => handleStockChange(e.target.checked)}
                    size="sm"
                  />
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
                    setInStockOnly(false);
                    setSelectedTags([]);
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

                {/* Tag Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Thẻ</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedTags([]);
                        filterByTags('');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa thẻ
                    </button>
                  )}
                </div>

                {/* Stock Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Tồn Kho</h3>
                  <Checkbox
                    label="Chỉ hiển thị hàng có sẵn"
                    checked={inStockOnly}
                    onChange={(e) => handleStockChange(e.target.checked)}
                    size="sm"
                  />
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
                    setInStockOnly(false);
                    setSelectedTags([]);
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
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-lg text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
                    <Button
                      onClick={() => {
                        setPriceRange({ min: 0, max: 100000000 });
                        setSelectedCategory('');
                        setSelectedRating(0);
                        setInStockOnly(false);
                        refreshProducts();
                        setCurrentPage(1);
                      }}
                    >
                      Xóa Bộ Lọc
                    </Button>
                  </motion.div>
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductPage;
