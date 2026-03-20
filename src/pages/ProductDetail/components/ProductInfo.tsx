import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Zap, CheckCircle2, Check } from 'lucide-react';
import type { Product } from '../../../types/product';
import Button from '../../../components/common/Button/Button';
import { useWishlist } from '../../../hooks/useWishlist';
import { useIsLoggedIn } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';

interface ProductInfoProps {
  product: Product;
  isLoading?: boolean;
  onAddToCart?: (productId: string, quantity: number) => void;
  onBuyNow?: (productId: string, quantity: number) => void;
}

/**
 * ProductInfo Component - Display detailed product information
 */
const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isLoading = false,
  onAddToCart,
  onBuyNow,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsLoggedIn();
  const { items: wishlistItems, toggleWishlist, isLoading: isTogglingWishlist } = useWishlist();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const productInWishlist = wishlistItems.some((item) => item.product.id === product.id);
    setIsInWishlist(productInWishlist);
  }, [wishlistItems, product.id]);

  const handleIncrement = () => {
    if (quantity < (product.stock || 100)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login', { state: { returnTo: window.location.pathname } });
      return;
    }

    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login', { state: { returnTo: window.location.pathname } });
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItem(product.id, quantity);
      
      // Show success feedback
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
      }, 2000);

      // Call optional callback
      onAddToCart?.(product.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    onBuyNow?.(product.id, quantity);
  };

  const rating = product.averageRating ? parseFloat(product.averageRating.toString()) : 0;
  const reviewCount = product.reviewCount || 0;
  const price = typeof product.price === 'string' ? parseInt(product.price) : product.price;
  const inStock = product.stock > 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-gray-300 rounded-lg" />
        <div className="h-6 bg-gray-300 rounded-lg w-1/3" />
        <div className="h-8 bg-gray-300 rounded-lg w-1/4" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-300 rounded-lg" />
          <div className="h-10 bg-gray-300 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-3 md:space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Name */}
      <motion.h1
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
        variants={itemVariants}
      >
        {product.name}
      </motion.h1>

      {/* Rating and Review */}
      <motion.div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" variants={itemVariants}>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`sm:w-4 sm:h-4 ${
                i < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
        <span className="text-gray-600">({reviewCount})</span>
      </motion.div>

      {/* Price and Wishlist */}
      <motion.div
        className="flex items-end justify-between gap-2 sm:gap-3"
        variants={itemVariants}
      >
        <div>
          <p className="text-xs text-gray-600 mb-0.5">Giá</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {price.toLocaleString('vi-VN')}đ
          </p>
        </div>
        <motion.button
          onClick={handleWishlist}
          disabled={isTogglingWishlist}
          className="p-2 sm:p-2.5 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isLoggedIn ? (isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích') : 'Đăng nhập để thêm vào yêu thích'}
        >
          <Heart
            size={18}
            className={`sm:w-5 sm:h-5 ${
              isInWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </motion.button>
      </motion.div>

      {/* Stock Status */}
      <motion.div className="flex items-center gap-1.5 text-xs sm:text-sm" variants={itemVariants}>
        <div
          className={`w-2 h-2 rounded-full ${
            inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          {inStock ? `Còn ${product.stock}` : 'Hết hàng'}
        </span>
      </motion.div>

      {/* Quantity Selector */}
      <motion.div className="space-y-1.5" variants={itemVariants}>
        <p className="text-xs font-medium text-gray-900">Số lượng</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <motion.button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              −
            </motion.button>
            <input
              type="text"
              inputMode="numeric"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setQuantity(0);
                  return;
                }
                const numValue = parseInt(value);
                if (!isNaN(numValue)) {
                  const validValue = Math.min(Math.max(numValue, 1), product.stock);
                  setQuantity(validValue);
                }
              }}
              onBlur={() => {
                if (quantity === 0) {
                  setQuantity(1);
                }
              }}
              className="w-12 sm:w-14 text-center font-semibold text-gray-900 border-0 outline-none text-xs sm:text-sm"
            />
            <motion.button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-2 pt-1" variants={itemVariants}>
        <Button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 bg-gray-900 text-white hover:bg-black text-xs sm:text-sm py-2.5 sm:py-2"
        >
          <Zap size={14} className="sm:w-4 sm:h-4 mr-1.5" />
          Mua ngay
        </Button>
        <motion.button
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
          className={`flex-1 py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 border ${
            addedSuccess
              ? 'bg-emerald-600 text-white border-emerald-600'
              : inStock
              ? 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300'
          }`}
          whileHover={inStock && !isAddingToCart ? { scale: 1.02 } : {}}
          whileTap={inStock && !isAddingToCart ? { scale: 0.98 } : {}}
          animate={isAddingToCart ? { opacity: 0.7 } : { opacity: 1 }}
        >
          <motion.div
            animate={isAddingToCart ? { rotate: 360 } : { rotate: 0 }}
            transition={isAddingToCart ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
          >
            {addedSuccess ? (
              <Check size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
            )}
          </motion.div>
          <span className="font-medium">
            {isAddingToCart ? 'Đang thêm...' : addedSuccess ? 'Đã thêm!' : 'Thêm vào giỏ'}
          </span>
        </motion.button>
      </motion.div>

      {/* Features */}
      <motion.div
        className="space-y-1.5 pt-3 sm:pt-4 border-t border-gray-200"
        variants={itemVariants}
      >
        <div className="flex items-start sm:items-center gap-2 sm:gap-2.5">
          <CheckCircle2 size={16} className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-xs sm:text-sm">Giao hàng nhanh (1-2 ngày)</span>
        </div>
        <div className="flex items-start sm:items-center gap-2 sm:gap-2.5">
          <CheckCircle2 size={16} className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-xs sm:text-sm">Đổi trả dễ dàng 30 ngày</span>
        </div>
        <div className="flex items-start sm:items-center gap-2 sm:gap-2.5">
          <CheckCircle2 size={16} className="sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-xs sm:text-sm">Bảo hành 100% hài lòng</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductInfo;
