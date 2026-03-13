import React, { useState, useRef, useEffect } from 'react';
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
  Home
} from 'lucide-react';
import Input from '../../common/Input/Input';
import logoSvg from '../../../assets/logo.svg';
import type { Category } from '../../../types/product';

interface HeaderProps {
  logo?: string;
  onSearch?: (query: string) => void;
  categories?: Category[];
  userMenuItems?: UserMenuItem[];
  cartCount?: number;
  wishlistCount?: number;
  isUserLoggedIn?: boolean;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onUserMenuClick?: () => void;
}

interface UserMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

/**
 * Header Component - E-commerce header with search, categories, user menu, cart, and wishlist
 */
const Header: React.FC<HeaderProps> = ({
  logo = 'TMDT Logo',
  onSearch,
  categories = [],
  userMenuItems = [],
  cartCount = 0,
  wishlistCount = 0,
  isUserLoggedIn = false,
  onCartClick,
  onWishlistClick,
  onUserMenuClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle outside click for menus
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
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
    onSearch?.(query);
  };

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
            className="flex-shrink-0 flex items-center gap-3 no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <img
              src={logoSvg}
              alt={logo}
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-black leading-tight tracking-wide">
                Fitness
              </span>
              <span className="text-lg md:text-xl font-bold text-gray-700 leading-tight tracking-wide">
                Mart
              </span>
            </div>
          </motion.a>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearch}
              startIcon={<Search size={18} />}
              inputSize="md"
              variant="filled"
              fullWidth
            />
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
                      {categories.map((category, i) => (
                        <motion.div
                          key={category.id}
                          variants={itemVariants}
                          custom={i}
                        >
                          <motion.button
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
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <motion.button
              className="relative p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onWishlistClick}
            >
              <Heart size={20} className="text-gray-700" />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
              <span className="text-xs text-gray-700">Yêu thích</span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              className="relative p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCartClick}
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {cartCount}
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
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  onUserMenuClick?.();
                }}
              >
                <User size={20} className="text-gray-700" />
                <span className="text-xs text-gray-700">
                  {isUserLoggedIn ? 'Tài khoản' : 'Đăng nhập'}
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
                    {!isUserLoggedIn ? (
                      <>
                        <motion.button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          Đăng nhập
                        </motion.button>
                        <motion.button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          Đăng ký
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.a
                          href="/profile"
                          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <User size={16} />
                          Thông tin cá nhân
                        </motion.a>
                        <motion.a
                          href="/orders"
                          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <ShoppingCart size={16} />
                          Đơn hàng của tôi
                        </motion.a>
                        <motion.a
                          href="/settings"
                          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <Settings size={16} />
                          Cài đặt
                        </motion.a>
                        <div className="border-t border-gray-200 my-2" />
                        <motion.button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </motion.button>
                      </>
                    )}

                    {userMenuItems.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 my-2" />
                        {userMenuItems.map((item, i) => (
                          <motion.button
                            key={i}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                            onClick={item.onClick}
                          >
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                          </motion.button>
                        ))}
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

            {/* Search Bar */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={handleSearch}
                startIcon={<Search size={16} />}
                inputSize="sm"
                variant="filled"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation Icons */}
        <div className="px-2 py-2 flex items-center justify-between border-t border-gray-100">
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
              <span className="text-xs text-gray-700">Danh mục</span>
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
                  {categories.map((category, i) => (
                    <motion.button
                      key={category.id}
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
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Button */}
          <motion.button
            className="flex-1 relative flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWishlistClick}
          >
            <Heart size={20} className="text-gray-700" />
            {wishlistCount > 0 && (
              <motion.span
                className="absolute top-0 right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {wishlistCount}
              </motion.span>
            )}
            <span className="text-xs text-gray-700">Yêu thích</span>
          </motion.button>

          {/* Cart Button */}
          <motion.button
            className="flex-1 relative flex flex-col items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCartClick}
          >
            <ShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <motion.span
                className="absolute top-0 right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {cartCount}
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
                onUserMenuClick?.();
              }}
            >
              <User size={20} className="text-gray-700" />
              <span className="text-xs text-gray-700">Tài khoản</span>
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
                  {!isUserLoggedIn ? (
                    <>
                      <motion.button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đăng nhập
                      </motion.button>
                      <motion.button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đăng ký
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.a
                        href="/profile"
                        className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Thông tin cá nhân
                      </motion.a>
                      <motion.a
                        href="/orders"
                        className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Đơn hàng của tôi
                      </motion.a>
                      <motion.a
                        href="/settings"
                        className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ paddingLeft: '24px', backgroundColor: '#f9fafb' }}
                      >
                        Cài đặt
                      </motion.a>
                      <div className="border-t border-gray-200 my-2" />
                      <motion.button
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
    </header>
  );
};

export default Header;
