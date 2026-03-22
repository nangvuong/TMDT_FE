import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  LogOut,
  Settings,
  Grid3x3,
  Home,
  Package
} from 'lucide-react';
import Input from '../../common/Input/Input';
import logoSvg from '../../../assets/logo.svg';
import { useLogout, useIsLoggedIn } from '../../../hooks/useAuth';
import { useProductSearch } from '../../../hooks/useProduct';
import { useCategories } from '../../../hooks/useProduct';
import { useWishlistCount } from '../../../hooks/useWishlist';
import { useCountersContext } from '../../../contexts/CountersContext';

interface HeaderProps {
  logo?: string;
  hideFAB?: boolean;
}

/**
 * Header Component - E-commerce header with search, categories, user menu, cart, and wishlist
 */
const Header: React.FC<HeaderProps> = ({ logo = 'TMDT Logo', hideFAB = false }) => {
  const navigate = useNavigate();
  const { logout: logoutUser } = useLogout();
  const { isLoggedIn } = useIsLoggedIn();
  const { results: searchResults, search: performSearch } = useProductSearch();
  const { categories, isLoading: isLoadingCategories, pagination: categoryPagination, setPage: setCategoryPage } = useCategories({ page: 1, limit: 6 });
  const wishlistCount = useWishlistCount();
  const { cartCount } = useCountersContext();
  
  // Use cached counts for better performance
  const computedWishlistCount = wishlistCount;
  const computedCartCount = isLoggedIn ? cartCount : 0;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  // Handle outside click for menus
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(query.length > 0);
    performSearch(query); // Show suggestions only, don't update product list
  };

  // Handle search submission (Enter key)
  const handleSearchSubmit = (query?: string) => {
    const finalQuery = query || searchQuery;
    if (finalQuery.trim()) {
      setSearchQuery('');
      setIsSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(finalQuery)}`);
    }
  };

  // Handle product suggestion click
  const handleProductSuggestionClick = (productId: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/products/${productId}`);
  };

  // Handle category suggestion click
  const handleCategorySuggestionClick = (categoryId: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/categories/${categoryId}`);
  };

  // Filter categories based on search query
  const filteredCategories = searchQuery.trim().length > 0
    ? categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300 },
    }),
  };

  const skeletonVariants: Variants = {
    loading: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:block px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex-shrink-0 flex items-center gap-2.5 no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <img
              src={logoSvg}
              alt={logo}
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold text-black leading-tight tracking-wide">
                Fitness
              </span>
              <span className="text-base md:text-lg font-bold text-gray-700 leading-tight tracking-wide">
                Mart
              </span>
            </div>
          </motion.a>

          {/* Search Bar with Suggestions */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              startIcon={<Search size={18} />}
              inputSize="md"
              variant="filled"
              fullWidth
            />

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchOpen && (searchResults.length > 0 || filteredCategories.length > 0) && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Products Section */}
                  {searchResults.length > 0 && (
                    <>
                      <div className="px-3 py-1">
                        <p className="text-xs text-gray-500 font-medium mb-2">Sản phẩm gợi ý</p>
                      </div>
                      {searchResults.slice(0, 5).map((product, i) => (
                        <motion.button
                          key={product.id}
                          onClick={() => handleProductSuggestionClick(product.id)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                          custom={i}
                          variants={itemVariants}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                        >
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.price?.toLocaleString('vi-VN')} đ
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </>
                  )}

                  {/* Categories Section */}
                  {filteredCategories.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-2" />
                      <div className="px-3 py-1">
                        <p className="text-xs text-gray-500 font-medium mb-2">Danh mục</p>
                      </div>
                      {filteredCategories.map((category, i) => (
                        <motion.button
                          key={category.id}
                          onClick={() => handleCategorySuggestionClick(category.id)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          custom={i}
                          variants={itemVariants}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                        >
                          <Grid3x3 size={16} className="text-gray-400" />
                          <span>{category.name}</span>
                        </motion.button>
                      ))}
                    </>
                  )}

                  {/* Search All Button */}
                  {searchQuery.trim().length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-2" />
                      <motion.button
                        onClick={() => handleSearchSubmit()}
                        className="w-full px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                      >
                        <Search size={16} className="text-gray-600" />
                        <span>Tìm kiếm "{searchQuery}"</span>
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-4">
            {/* Categories Mega Menu */}
            <div 
              className="relative" 
              ref={categoryMenuRef}
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <motion.button
                className="px-4 py-2 text-gray-700 hover:text-black flex items-center gap-2 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <span className="text-sm font-medium">Danh mục</span>
                <motion.div
                  animate={{ rotate: isCategoryMenuOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </motion.button>

              {/* Category Mega Menu */}
              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    className="fixed inset-x-0 top-20 bg-white border border-gray-200 rounded-lg shadow-2xl p-6 mx-0"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {isLoadingCategories ? (
                        // Skeleton Loading
                        Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={`skeleton-${i}`}
                            className="flex flex-col items-start gap-2 p-3 rounded-lg w-full"
                          >
                            <motion.div 
                              className="w-full h-32 bg-gray-200 rounded-lg"
                              variants={skeletonVariants}
                              animate="loading"
                            />
                            <motion.div 
                              className="w-full h-4 bg-gray-200 rounded"
                              variants={skeletonVariants}
                              animate="loading"
                            />
                            <motion.div 
                              className="w-3/4 h-3 bg-gray-200 rounded"
                              variants={skeletonVariants}
                              animate="loading"
                            />
                          </motion.div>
                        ))
                      ) : (
                        // Actual Categories
                        categories.map((category, i) => (
                          <motion.div
                            key={category.id}
                            variants={itemVariants}
                            custom={i}
                          >
                            <motion.button
                              onClick={() => {
                                navigate(`/categories/${category.id}`);
                                setIsCategoryMenuOpen(false);
                              }}
                              className="flex flex-col items-start gap-2 p-3 rounded-lg w-full hover:bg-gray-50 group"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                                {category.imageUrl ? (
                                  <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <motion.div 
                                    className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                                    variants={skeletonVariants}
                                    animate="loading"
                                  />
                                )}
                              </div>
                              <div className="text-left w-full">
                                <h3 className="font-medium text-gray-900 text-sm">
                                  {category.name}
                                </h3>
                                {category.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </motion.button>
                          </motion.div>
                        ))
                      )}
                    </div>
                    {/* Pagination Controls */}
                    {!isLoadingCategories && (categoryPagination.totalPages || 0) > 1 && (
                      <div 
                        className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200"
                        onMouseEnter={() => setIsCategoryMenuOpen(true)}
                        onMouseLeave={() => setIsCategoryMenuOpen(true)}
                      >
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCategoryPage(Math.max(1, (categoryPagination.page || 1) - 1));
                            setIsCategoryMenuOpen(true)
                          }}
                          disabled={(categoryPagination.page || 1) === 1}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ← Trước
                        </motion.button>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: categoryPagination.totalPages || 1 }).map((_, index) => {
                            const page = index + 1;
                            return (
                              <motion.button
                                key={page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setCategoryPage(page);
                                  setIsCategoryMenuOpen(true)
                                }}
                                className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
                                  (categoryPagination.page || 1) === page
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {page}
                              </motion.button>
                            );
                          })}
                        </div>
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCategoryPage(Math.min(categoryPagination.totalPages || 1, (categoryPagination.page || 1) + 1));
                            setIsCategoryMenuOpen(true)
                          }}
                          disabled={(categoryPagination.page || 1) === (categoryPagination.totalPages || 1)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Sau →
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <motion.button
              className="relative p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWishlistClick}
            >
              <Heart size={20} className="text-gray-700" />
              {computedWishlistCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {computedWishlistCount}
                </motion.span>
              )}
              <span className="text-xs text-gray-700">Yêu thích</span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              className="relative p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCartClick}
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {computedCartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {computedCartCount}
                </motion.span>
              )}
              <span className="text-xs text-gray-700">Giỏ hàng</span>
            </motion.button>

            {/* User Menu */}
            <div 
                className="relative" 
                ref={userMenuRef}
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <motion.button
                className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={20} className="text-gray-700" />
                <span className="text-xs text-gray-700">
                  {isLoggedIn ? 'Tài khoản' : 'Đăng nhập'}
                </span>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <ChevronDown size={16} className="text-gray-700" />
                </motion.div>
              </motion.button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {!isLoggedIn ? (
                      <>
                        <motion.a
                          href="/login"
                          className="w-full block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 no-underline"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          Đăng nhập
                        </motion.a>
                        <motion.a
                          href="/register"
                          className="w-full block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 no-underline"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          Đăng ký
                        </motion.a>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => {
                            navigate('/profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <User size={16} />
                          Hồ sơ thể chất
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            navigate('/orders');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <Package size={16} />
                          Đơn hàng của tôi
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            navigate('/setting');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <Settings size={16} />
                          Cài đặt
                        </motion.button>
                        <div className="border-t border-gray-200 my-2" />
                        <motion.button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Row: Logo + Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex-shrink-0 flex items-center gap-2 no-underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <img
                src={logoSvg}
                alt={logo}
                className="h-9 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-black leading-tight tracking-wide">
                  Fitness
                </span>
                <span className="text-xs font-bold text-gray-700 leading-tight tracking-wide">
                  Mart
                </span>
              </div>
            </motion.a>

            {/* Search Bar with Suggestions */}
            <div className="flex-1 relative" ref={searchRef}>
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                startIcon={<Search size={16} />}
                inputSize="md"
                variant="filled"
                fullWidth
              />

              {/* Search Suggestions Dropdown (Mobile) */}
              <AnimatePresence>
                {isSearchOpen && (searchResults.length > 0 || filteredCategories.length > 0) && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-64 overflow-y-auto"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Products Section */}
                    {searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-1">
                          <p className="text-xs text-gray-500 font-medium mb-2">Sản phẩm</p>
                        </div>
                        {searchResults.slice(0, 5).map((product, i) => (
                          <motion.button
                            key={product.id}
                            onClick={() => handleProductSuggestionClick(product.id)}
                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                            custom={i}
                            variants={itemVariants}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                          >
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-6 h-6 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0" />
                            )}
                            <span className="truncate">{product.name}</span>
                          </motion.button>
                        ))}
                      </>
                    )}

                    {/* Categories Section */}
                    {filteredCategories.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-2" />
                        <div className="px-3 py-1">
                          <p className="text-xs text-gray-500 font-medium mb-2">Danh mục</p>
                        </div>
                        {filteredCategories.slice(0, 5).map((category, i) => (
                          <motion.button
                            key={category.id}
                            onClick={() => handleCategorySuggestionClick(category.id)}
                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                            custom={i}
                            variants={itemVariants}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                          >
                            <Grid3x3 size={14} className="text-gray-400" />
                            <span>{category.name}</span>
                          </motion.button>
                        ))}
                      </>
                    )}

                    {/* Search All Button */}
                    {searchQuery.trim().length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-2" />
                        <motion.button
                          onClick={() => handleSearchSubmit()}
                          className="w-full px-3 py-2 text-left text-xs font-medium text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                        >
                          <Search size={14} className="text-gray-600" />
                          <span>Tìm kiếm "{searchQuery}"</span>
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bottom */}
      {!hideFAB && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        {/* Bottom Row: Navigation Icons */}
        <div className="px-2 py-2 flex items-center justify-between">
          {/* Home Button */}
          <motion.a
            href="/"
            className="flex-1 flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={20} className="text-gray-700" />
            <span className="text-xs text-gray-700 text-center">Trang chủ</span>
          </motion.a>

          {/* Categories Button */}
          <div className="flex-1 relative" ref={categoryMenuRef}>
            <motion.button
              className="w-full flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            >
              <Grid3x3 size={20} className="text-gray-700" />
              <span className="text-xs text-gray-700 whitespace-nowrap">Danh mục</span>
            </motion.button>

            {/* Category Mobile Menu */}
            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div
                  className="absolute left-0 top-0 -translate-y-full bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 max-h-64 overflow-y-auto mb-2"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {isLoadingCategories ? (
                    // Skeleton Loading
                    Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        className="w-full px-4 py-3 flex items-center gap-3"
                      >
                        <motion.div 
                          className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"
                          variants={skeletonVariants}
                          animate="loading"
                        />
                        <motion.div 
                          className="h-4 flex-1 bg-gray-200 rounded"
                          variants={skeletonVariants}
                          animate="loading"
                        />
                      </motion.div>
                    ))
                  ) : (
                    // Actual Categories
                    categories.map((category, i) => (
                      <motion.button
                        key={category.id}
                        onClick={() => {
                          navigate(`/categories/${category.id}`);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        variants={itemVariants}
                        custom={i}
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <motion.div 
                              className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
                              variants={skeletonVariants}
                              animate="loading"
                            />
                          )}
                        </div>
                        <span>{category.name}</span>
                      </motion.button>
                    ))
                  )}
                  {/* Mobile Pagination */}
                  {!isLoadingCategories && (categoryPagination.totalPages || 0) > 1 && (
                    <div 
                      className="border-t border-gray-200 mt-2 pt-2 px-4 py-2 flex items-center justify-between"
                      onMouseEnter={() => setIsCategoryMenuOpen(true)}
                      onMouseLeave={() => setIsCategoryMenuOpen(true)}
                    >
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCategoryPage(Math.max(1, (categoryPagination.page || 1) - 1));
                          setIsCategoryMenuOpen(true)
                        }}
                        disabled={(categoryPagination.page || 1) === 1}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ←
                      </motion.button>
                      <span className="text-xs text-gray-600">
                        {categoryPagination.page || 1} / {categoryPagination.totalPages || 1}
                      </span>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCategoryPage(Math.min(categoryPagination.totalPages || 1, (categoryPagination.page || 1) + 1));
                          setIsCategoryMenuOpen(true)
                        }}
                        disabled={(categoryPagination.page || 1) === (categoryPagination.totalPages || 1)}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        →
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Button */}
          <motion.button
            className="flex-1 relative flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWishlistClick}
          >
            <Heart size={20} className="text-gray-700" />
            {computedWishlistCount > 0 && (
              <motion.span
                className="absolute top-0 right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {computedWishlistCount}
              </motion.span>
            )}
            <span className="text-xs text-gray-700">Yêu thích</span>
          </motion.button>

          {/* Cart Button */}
          <motion.button
            className="flex-1 relative flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCartClick}
          >
            <ShoppingCart size={20} className="text-gray-700" />
            {computedCartCount > 0 && (
              <motion.span
                className="absolute top-0 right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {computedCartCount}
              </motion.span>
            )}
            <span className="text-xs text-gray-700">Giỏ hàng</span>
          </motion.button>

          {/* User Menu */}
          <div className="flex-1 relative" ref={userMenuRef}>
            <motion.button
              className="w-full flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
            >
              <User size={20} className="text-gray-700" />
              <span className="text-xs text-gray-700">{isLoggedIn ? "Tài khoản" : "Đăng nhập"}</span>
            </motion.button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  className="absolute right-0 bottom-16 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {!isLoggedIn ? (
                    <>
                      <motion.a
                        href="/login"
                        className="w-full block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đăng nhập
                      </motion.a>
                      <motion.a
                        href="/register"
                        className="w-full block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đăng ký
                      </motion.a>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => {
                          navigate('/profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Hồ sơ thể chất
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          navigate('/orders');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đơn hàng của tôi
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          navigate('/setting');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Cài đặt
                      </motion.button>
                      <div className="border-t border-gray-200 my-2" />
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đăng xuất
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      )}
    </header>
  );
};

export default Header;
