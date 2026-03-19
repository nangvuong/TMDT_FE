import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../../types/product';
import Button from '../../../components/common/Button/Button';
import { useWishlist } from '../../../hooks/useWishlist';
import { useIsLoggedIn } from '../../../hooks/useAuth';

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
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

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

  const handleAddToCart = () => {
    onAddToCart?.(product.id, quantity);
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
      className="space-y-4 md:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Name */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
        variants={itemVariants}
      >
        {product.name}
      </motion.h1>

      {/* Rating and Review */}
      <motion.div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base" variants={itemVariants}>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`sm:w-5 sm:h-5 ${
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
        className="flex items-end justify-between gap-3 sm:gap-4"
        variants={itemVariants}
      >
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-0.5">Giá</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {price.toLocaleString('vi-VN')}đ
          </p>
        </div>
        <motion.button
          onClick={handleWishlist}
          disabled={isTogglingWishlist}
          className="p-2.5 sm:p-3 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isLoggedIn ? (isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích') : 'Đăng nhập để thêm vào yêu thích'}
        >
          <Heart
            size={20}
            className={`sm:w-6 sm:h-6 ${
              isInWishlist
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </motion.button>
      </motion.div>

      {/* Stock Status */}
      <motion.div className="flex items-center gap-2 text-sm sm:text-base" variants={itemVariants}>
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          {inStock ? `Còn ${product.stock}` : 'Hết hàng'}
        </span>
      </motion.div>

      {/* Quantity Selector */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <p className="text-xs sm:text-sm font-medium text-gray-900">Số lượng</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <motion.button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-lg sm:text-xl"
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
              className="w-14 sm:w-16 text-center font-semibold text-gray-900 border-0 outline-none text-sm sm:text-base"
            />
            <motion.button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-lg sm:text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1" variants={itemVariants}>
        <Button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 bg-gray-900 text-white hover:bg-black text-sm sm:text-base py-3 sm:py-2.5"
        >
          <Zap size={16} className="sm:w-[18px] sm:h-[18px] mr-1.5 sm:mr-2" />
          Mua ngay
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          variant="outline"
          className="flex-1 text-sm sm:text-base py-3 sm:py-2.5"
        >
          <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px] mr-1.5 sm:mr-2" />
          Thêm vào giỏ
        </Button>
      </motion.div>

      {/* Features */}
      <motion.div
        className="space-y-2 pt-4 sm:pt-6 border-t border-gray-200"
        variants={itemVariants}
      >
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-sm sm:text-base">Giao hàng nhanh (1-2 ngày)</span>
        </div>
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-sm sm:text-base">Đổi trả dễ dàng 30 ngày</span>
        </div>
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-gray-700 text-sm sm:text-base">Bảo hành 100% hài lòng</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductInfo;
