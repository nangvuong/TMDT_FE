import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Button from '../common/Button/Button';
import { formatVND } from '../../utils/formatPrice';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  description?: string;
  image?: string;
  tags?: string[];
  stock?: number;
  averageRating?: number | string;
  reviewCount?: number;
  onClick?: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  description,
  image,
  tags = [],
  stock = 0,
  averageRating,
  reviewCount = 0,
  onClick,
  onAddToCart,
  onAddToWishlist,
}) => {
  const isInStock = stock > 0;
  const rating = typeof averageRating === 'string' ? parseFloat(averageRating) : (averageRating || 0);
  const tagColors: Record<string, string> = {
    'bestseller': 'bg-red-600',
    'new': 'bg-blue-600',
    'on-sale': 'bg-amber-600',
    'featured': 'bg-purple-600',
    'trending': 'bg-rose-600',
  };

  return (
    <motion.div
      className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Image Container */}
      <div
        className="relative w-full h-36 sm:h-40 md:h-48 lg:h-56 overflow-hidden bg-gray-200 cursor-pointer group"
        onClick={onClick}
      >
        {image ? (
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`${tagColors[tag]} text-white text-xs font-semibold px-2 py-1 rounded`}
              >
                {tag === 'on-sale' ? 'Sale' : tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>
        )}

        {/* Stock Badge */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Hết Hàng</span>
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist?.();
          }}
        >
          <Heart size={18} className="text-red-500" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        {/* Name */}
        <h3
          className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base line-clamp-2 cursor-pointer hover:text-black transition-colors"
          onClick={onClick}
        >
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}

        {/* Spacer - pushes stock info and price to fixed position */}
        <div className="flex-1" />

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Star
                    size={14}
                    className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              {rating.toFixed(1)}
              {reviewCount > 0 && <span className="text-gray-500"> ({reviewCount})</span>}
            </span>
          </div>
        )}

        {/* Stock Info */}
        <p className={`text-xs font-medium mt-2 sm:mt-3 ${isInStock ? 'text-emerald-600' : 'text-red-600'}`}>
          {isInStock ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
        </p>

        {/* Price */}
        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mt-2 sm:mt-3">
          {formatVND(typeof price === 'string' ? parseFloat(price) : price)}
        </p>

        {/* Buttons */}
        <Button
          onClick={onAddToCart}
          variant="primary"
          size="md"
          disabled={!isInStock}
          fullWidth
          className="text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4"
        >
          <ShoppingCart size={14} className="sm:hidden" />
          <ShoppingCart size={16} className="hidden sm:block" />
          <span className="text-xs sm:text-sm font-medium">Thêm vào giỏ</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
