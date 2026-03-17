import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../../types/product';
import Button from '../../../components/common/Button/Button';

interface ProductInfoProps {
  product: Product;
  isLoading?: boolean;
  onAddToCart?: (productId: string, quantity: number) => void;
  onBuyNow?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
}

/**
 * ProductInfo Component - Display detailed product information
 */
const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  isLoading = false,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product.id);
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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Name */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-gray-900"
        variants={itemVariants}
      >
        {product.name}
      </motion.h1>

      {/* Rating and Review */}
      <motion.div className="flex items-center gap-4" variants={itemVariants}>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={`${
                i < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
        <span className="text-gray-600">({reviewCount} đánh giá)</span>
      </motion.div>

      {/* Price and Wishlist */}
      <motion.div
        className="flex items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <p className="text-sm text-gray-600 mb-1">Giá</p>
          <p className="text-4xl font-bold text-gray-900">
            {price.toLocaleString('vi-VN')}đ
          </p>
        </div>
        <motion.button
          onClick={handleWishlist}
          className="p-3 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={24}
            className={`${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </motion.button>
      </motion.div>

      {/* Stock Status */}
      <motion.div className="flex items-center gap-2" variants={itemVariants}>
        <div
          className={`w-3 h-3 rounded-full ${
            inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          {inStock ? `Còn hàng: ${product.stock}` : 'Hết hàng'}
        </span>
      </motion.div>

      {/* Quantity Selector */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <p className="text-sm font-medium text-gray-900">Số lượng</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <motion.button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
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
                // Cho phép trống tạm thời khi đang xoá
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
                // Nếu trống, reset về 1
                if (quantity === 0) {
                  setQuantity(1);
                }
              }}
              className="w-12 text-center font-semibold text-gray-900 border-0 outline-none"
            />
            <motion.button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="flex gap-4" variants={itemVariants}>
        <Button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 bg-gray-900 text-white hover:bg-black"
        >
          <Zap size={18} className="mr-2" />
          Mua ngay
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          variant="outline"
          className="flex-1"
        >
          <ShoppingCart size={18} className="mr-2" />
          Thêm vào giỏ
        </Button>
      </motion.div>

      {/* Features */}
      <motion.div
        className="space-y-3 pt-6 border-t border-gray-200"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="text-gray-700 font-medium">Giao hàng nhanh (1-2 ngày)</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="text-gray-700 font-medium">Đổi trả dễ dàng trong 30 ngày</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600" />
          <span className="text-gray-700 font-medium">Bảo hành 100% hài lòng</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductInfo;
