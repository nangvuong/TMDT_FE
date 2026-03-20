import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
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
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  description,
  image,
  tags = [],
  stock = 0,
  averageRating,
  reviewCount = 0,
  onClick,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsLoggedIn();
  const { items: wishlistItems, toggleWishlist, isLoading: isTogglingWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isInStock = stock > 0;
  const rating = typeof averageRating === 'string' ? parseFloat(averageRating) : (averageRating || 0);

  // Check if product is in wishlist
  useEffect(() => {
    const productInWishlist = wishlistItems.some((item) => item.product.id === id);
    setIsInWishlist(productInWishlist);
  }, [wishlistItems, id]);

  const handleProductClick = () => {
    navigate(`/products/${id}`);
    onClick?.();
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login', { state: { returnTo: window.location.pathname } });
      return;
    }

    try {
      setIsAddingToWishlist(true);
      await toggleWishlist(id);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    } finally {
      setIsAddingToWishlist(false);
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
      await addItem(id, 1);
      
      // Show success feedback
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };
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
      <motion.div
        className="relative w-full h-36 sm:h-40 md:h-48 lg:h-56 overflow-hidden bg-gray-200 cursor-pointer group"
        onClick={handleProductClick}
        whileHover="hover"
        initial="initial"
      >
        {image ? (
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.1 }
            }}
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

        {/* Hover Overlay - Mua ngay Button */}
        {isInStock && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick();
              }}
              variants={{
                initial: { scale: 0.8, opacity: 0 },
                hover: { scale: 1, opacity: 1 }
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Mua ngay
            </motion.button>
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.button
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlistClick}
          disabled={isAddingToWishlist || isTogglingWishlist}
          title={isLoggedIn ? (isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích') : 'Đăng nhập để thêm vào yêu thích'}
        >
          <Heart 
            size={18} 
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-red-500'}
          />
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        {/* Name */}
        <h3
          className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base line-clamp-2 cursor-pointer hover:text-black transition-colors"
          onClick={handleProductClick}
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
        <motion.button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-2 sm:mt-3 md:mt-4 ${
            addedSuccess
              ? 'bg-emerald-600 text-white'
              : isInStock
              ? 'bg-gray-900 text-white hover:bg-black'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          whileHover={isInStock && !isAddingToCart ? { scale: 1.02 } : {}}
          whileTap={isInStock && !isAddingToCart ? { scale: 0.98 } : {}}
          animate={isAddingToCart ? { opacity: 0.7 } : { opacity: 1 }}
        >
          <motion.div
            animate={isAddingToCart ? { rotate: 360 } : { rotate: 0 }}
            transition={isAddingToCart ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
          >
            {addedSuccess ? (
              <Check size={16} className="sm:w-5 sm:h-5" />
            ) : (
              <ShoppingCart size={14} className="sm:hidden" />
            )}
            {!addedSuccess && <ShoppingCart size={16} className="hidden sm:block" />}
          </motion.div>
          <span className="font-medium">
            {isAddingToCart ? 'Đang thêm...' : addedSuccess ? 'Đã thêm!' : 'Thêm vào giỏ'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
