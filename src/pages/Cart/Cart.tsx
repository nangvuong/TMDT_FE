import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CartSkeleton from '../../components/loading/CartSkeleton';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useCart } from '../../hooks/useCart';
import { useCoupon } from '../../hooks/useCoupon';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useWishlist } from '../../hooks/useWishlist';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Shopping Cart Page - Display and manage cart items
 */
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsLoggedIn();
  usePageTitle('Shopping Cart | Fitness Mart');
  useScrollReset([]);
  const alert = useAlert();

  const {
    cartItems,
    isLoading,
    isEmpty,
    removeItem,
    addItem,
  } = useCart();

  const { addToWishlist } = useWishlist();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [couponCode, setCouponCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showSummaryBar, setShowSummaryBar] = useState(true);
  const cartContainerRef = useRef<HTMLDivElement>(null);
  const cartSummaryRef = useRef<HTMLDivElement>(null);

  // Calculate selected total first
  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => {
        const itemPrice =
          typeof item.product?.price === 'string'
            ? parseFloat(item.product.price)
            : item.product?.price || 0;
        return sum + itemPrice * (quantities[item.id] || 1);
      }, 0);
  };

  const selectedTotal = calculateSelectedTotal();

  // Coupon hook - use effective amount (only selected items count)
  const effectiveAmount = selectedItems.size > 0 ? selectedTotal : 0;
  const { coupon, discount, isLoading: isCouponLoading, error: couponError, validateCoupon, clearCoupon, isCouponApplied } = useCoupon(effectiveAmount);

  // Initialize quantities from cart items
  React.useEffect(() => {
    const newQuantities: Record<string, number> = {};
    cartItems.forEach((item) => {
      newQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(newQuantities);
  }, [cartItems]);

  // Hide summary bar when scrolling to cart summary section
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSummaryBar(!entry.isIntersecting);
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    if (cartSummaryRef.current) {
      observer.observe(cartSummaryRef.current);
    }

    return () => observer.disconnect();
  }, []);



  const handleQuantityInputChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const currentQuantity = quantities[itemId] || 1;
    const item = cartItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    try {
      if (newQuantity > currentQuantity) {
        // Increase quantity: add the difference
        await addItem(item.productId, newQuantity - currentQuantity);
      } else if (newQuantity > 0 && newQuantity < currentQuantity) {
        // Decrease quantity: remove and re-add with new quantity
        await removeItem(itemId);
        if (newQuantity > 0) {
          await addItem(item.productId, newQuantity);
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const toggleSelectItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }
    await validateCoupon(couponCode);
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    clearCoupon();
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      alert.showWarning('Thông báo', 'Vui lòng chọn sản phẩm để xóa');
      return;
    }
    
    alert.showWarning(
      'Xóa sản phẩm',
      `Bạn có chắc chắn muốn xóa ${selectedItems.size} sản phẩm khỏi giỏ hàng?`,
      async () => {
        for (const itemId of selectedItems) {
          await removeItem(itemId);
        }
        setSelectedItems(new Set());
      },
      { confirmText: 'Xóa', cancelText: 'Hủy' }
    );
  };

  const handleSaveToWishlist = async () => {
    if (selectedItems.size === 0) {
      alert.showWarning('Thông báo', 'Vui lòng chọn sản phẩm để lưu');
      return;
    }

    try {
      for (const itemId of selectedItems) {
        const cartItem = cartItems.find((i) => i.id === itemId);
        if (cartItem) await addToWishlist(cartItem.productId);
      }
      alert.showSuccess('Thành công', `Đã lưu ${selectedItems.size} sản phẩm vào danh sách yêu thích`);
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Failed to save to wishlist:', error);
      alert.showError('Lỗi', 'Lưu thất bại. Vui lòng thử lại!');
    }
  };

  const handleProceedCheckout = async () => {
    // Auto-select all items if none are selected
    let itemsToCheckout = selectedItems;
    if (selectedItems.size === 0) {
      itemsToCheckout = new Set(cartItems.map((item) => item.id));
      setSelectedItems(itemsToCheckout);
    }

    // Check if there are unselected items
    const unselectedItems = cartItems.filter(item => !itemsToCheckout.has(item.id));
    if (unselectedItems.length > 0) {
      alert.showWarning(
        'Xóa sản phẩm không chọn',
        `Sẽ xóa ${unselectedItems.length} sản phẩm không chọn khỏi giỏ hàng. Tiếp tục?`,
        async () => {
          // Remove unselected items
          for (const item of unselectedItems) {
            await removeItem(item.id);
          }

          // Pass coupon and discount info to checkout page
          const checkoutParams = {
            ...(isCouponApplied && coupon && {
              couponCode: coupon.code,
              discount: discount,
            }),
          };
          
          navigate('/checkout', { state: checkoutParams });
        },
        { confirmText: 'Tiếp tục', cancelText: 'Hủy' }
      );
      return;
    }

    // If all items are selected (or auto-selected), go directly to checkout
    const checkoutParams = {
      ...(isCouponApplied && coupon && {
        couponCode: coupon.code,
        discount: discount,
      }),
    };
    
    navigate('/checkout', { state: checkoutParams });
  };

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

  const itemVariants: Record<string, any> = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
      },
    },
  };

  return (
    <Layout hideFAB>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 lg:py-16">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-6 sm:mb-8 group"
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
            className="mb-4 sm:mb-6 md:mb-8 flex items-start gap-2 sm:gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-2 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h1
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Giỏ Hàng Của Bạn
              </motion.h1>
              <motion.div
                className="h-0.5 w-12 bg-gradient-to-r from-gray-900 to-gray-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          {isLoading ? (
            <CartSkeleton count={3} />
          ) : isEmpty ? (
            // Empty Cart State
            <motion.div
              className="text-center py-16 sm:py-20 md:py-24"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gray-100 rounded-2xl">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Hãy khám phá bộ sưu tập sản phẩm fitness của chúng tôi và thêm các mặt hàng yêu thích của bạn.
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gray-900 text-white hover:bg-black"
              >
                Tiếp tục mua sắm
              </Button>
            </motion.div>
          ) : (
            <div className="pb-32" ref={cartContainerRef}>
              {/* Cart Items */}
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow ${selectedItems.has(item.id) ? 'border-2 border-gray-900' : 'border border-transparent'}`}
                    variants={itemVariants}
                  >
                    {/* Cart Item Table Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4">
                      {/* Row 1 (Mobile): Checkbox, Image, Product Info, Remove, Quantity */}
                      <div className="flex items-center justify-center gap-3 sm:hidden">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => toggleSelectItem(item.id, e as any)}
                            className="w-5 h-5 accent-gray-900 cursor-pointer"
                          />
                        </div>

                        {/* Product Image */}
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product?.images && item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div
                          className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className={`text-xs ${(item.product?.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(item.product?.stock ?? 0) > 0 ? '✓ Còn hàng' : '✗ Hết hàng'}
                          </p>
                        </div>

                        {/* Remove Button (Mobile) */}
                        <motion.button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex-shrink-0 p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Row 2 (Mobile): Quantity, Unit Price, Total Price */}
                      <div className="flex items-center gap-3 sm:hidden w-full">
                        <div className="flex-1 text-center min-w-0">
                          <p className="text-gray-500 text-xs mb-1">Số lượng</p>
                          <div className="flex items-center justify-center border border-gray-300 rounded-lg h-8 w-24 mx-auto">
                            <motion.button
                              onClick={() =>
                                handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)
                              }
                              disabled={(quantities[item.id] || 1) <= 1}
                              className="flex-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-xs"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              −
                            </motion.button>
                            <input
                              type="text"
                              inputMode="numeric"
                              min="1"
                              value={quantities[item.id] || 1}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  handleQuantityInputChange(item.id, 0);
                                  return;
                                }
                                const numValue = parseInt(value);
                                if (!isNaN(numValue)) {
                                  const validValue = Math.max(numValue, 1);
                                  handleQuantityInputChange(item.id, validValue);
                                }
                              }}
                              onBlur={() => {
                                const currentQty = quantities[item.id] || 1;
                                if (currentQty === 0) {
                                  handleQuantityInputChange(item.id, 1);
                                } else if (currentQty !== item.quantity) {
                                  handleQuantityChange(item.id, currentQty);
                                }
                              }}
                              className="w-6 text-center font-semibold text-gray-900 border-0 outline-none text-xs border-l border-r border-gray-300"
                            />
                            <motion.button
                              onClick={() =>
                                handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)
                              }
                              className="flex-1 text-gray-600 hover:text-gray-900 font-semibold text-xs"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex-1 text-center min-w-0">
                          <p className="text-gray-500 text-xs mb-1">Đơn giá</p>
                          <p className="font-semibold text-gray-900 text-xs">
                            {formatPrice(
                              typeof item.product?.price === 'string'
                                ? parseFloat(item.product.price)
                                : item.product?.price || 0
                            )}
                          </p>
                        </div>

                        <div className="flex-1 text-center min-w-0">
                          <p className="text-gray-500 text-xs mb-1">Thành tiền</p>
                          <p className="font-bold text-gray-900 text-sm">
                            {formatPrice(
                              (typeof item.product?.price === 'string'
                                ? parseFloat(item.product.price)
                                : item.product?.price || 0) * (quantities[item.id] || 1)
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Layout (sm+) */}
                      <div className="hidden sm:flex sm:items-center sm:justify-center sm:gap-4 w-full">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => toggleSelectItem(item.id, e as any)}
                            className="w-5 h-5 accent-gray-900 cursor-pointer"
                          />
                        </div>

                        {/* Product Image */}
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product?.images && item.product.images[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div
                          className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className={`text-xs ${(item.product?.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(item.product?.stock ?? 0) > 0 ? '✓ Còn hàng' : '✗ Hết hàng'}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex-shrink-0 text-center">
                          <p className="text-gray-500 text-xs mb-1.5">Số lượng</p>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <motion.button
                              onClick={() =>
                                handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)
                              }
                              disabled={(quantities[item.id] || 1) <= 1}
                              className="px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 font-semibold text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              −
                            </motion.button>
                            <input
                              type="text"
                              inputMode="numeric"
                              min="1"
                              value={quantities[item.id] || 1}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  handleQuantityInputChange(item.id, 0);
                                  return;
                                }
                                const numValue = parseInt(value);
                                if (!isNaN(numValue)) {
                                  const validValue = Math.max(numValue, 1);
                                  handleQuantityInputChange(item.id, validValue);
                                }
                              }}
                              onBlur={() => {
                                const currentQty = quantities[item.id] || 1;
                                if (currentQty === 0) {
                                  handleQuantityInputChange(item.id, 1);
                                } else if (currentQty !== item.quantity) {
                                  handleQuantityChange(item.id, currentQty);
                                }
                              }}
                              className="w-8 text-center font-semibold text-gray-900 border-0 outline-none text-sm"
                            />
                            <motion.button
                              onClick={() =>
                                handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)
                              }
                              className="px-2 py-1 text-gray-600 hover:text-gray-900 font-semibold text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="flex-shrink-0 text-center min-w-[80px]">
                          <p className="text-gray-500 text-xs mb-1.5">Đơn giá</p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatPrice(
                              typeof item.product?.price === 'string'
                                ? parseFloat(item.product.price)
                                : item.product?.price || 0
                            )}
                          </p>
                        </div>

                        {/* Total Price */}
                        <div className="flex-shrink-0 text-center min-w-[100px]">
                          <p className="text-gray-500 text-xs mb-1.5">Thành tiền</p>
                          <p className="font-bold text-gray-900 text-base">
                            {formatPrice(
                              (typeof item.product?.price === 'string'
                                ? parseFloat(item.product.price)
                                : item.product?.price || 0) * (quantities[item.id] || 1)
                            )}
                          </p>
                        </div>

                        {/* Remove Button (Desktop) */}
                        <motion.button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex-shrink-0 p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Cart End Marker */}
              <div className="h-0" />

              {/* Cart Summary Bar */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
                initial={{ opacity: 0, y: 100 }}
                animate={showSummaryBar ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  pointerEvents: showSummaryBar ? 'auto' : 'none',
                  visibility: showSummaryBar ? 'visible' : 'hidden'
                }}
              >
                <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-0">
                  {/* Row 1: Coupon Code */}
                  <div className="space-y-2 py-2 sm:py-3 border-b border-gray-200">
                    {!isCouponApplied ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          inputSize="sm"
                          className="text-xs flex-1"
                          disabled={isCouponLoading}
                          maxLength={20}
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={isCouponLoading || !couponCode.trim()}
                          className="bg-gray-900 text-white hover:bg-black px-3 sm:px-4 text-xs font-medium whitespace-nowrap disabled:opacity-50"
                        >
                          {isCouponLoading ? 'Kiểm tra...' : 'Áp dụng'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-green-700 font-medium truncate">
                              Mã: <span className="font-bold">{coupon?.code}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleClearCoupon}
                          className="text-xs text-green-600 hover:text-red-600 whitespace-nowrap ml-2 underline"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <motion.div
                        className="flex items-start gap-2 bg-red-50 p-2 rounded-lg border border-red-200"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-red-700 leading-tight">{couponError}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Row 2: Actions & Price Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 py-2 sm:py-3">
                    {/* Left: Selection & Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 accent-gray-900 cursor-pointer"
                        />
                        <span className="text-xs text-gray-600 whitespace-nowrap">Chọn tất cả</span>
                      </label>

                      <span className="text-gray-300">|</span>

                      <button
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.size === 0}
                        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Xóa
                      </button>

                      <span className="text-gray-300">|</span>

                      <button
                        onClick={handleSaveToWishlist}
                        disabled={selectedItems.size === 0}
                        className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Lưu
                      </button>
                    </div>

                    {/* Right: Price & Checkout */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-xs sm:text-sm flex flex-col items-end">
                        {isCouponApplied && discount > 0 && (
                          <span className="text-green-600 font-medium mb-1">
                            Tiết kiệm: {formatPrice(discount)}
                          </span>
                        )}
                        <div>
                          <span className="text-gray-600">Tổng: </span>
                          <span className="font-bold text-gray-900">
                            {formatPrice((selectedItems.size > 0 ? selectedTotal : 0) - discount)}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={handleProceedCheckout}
                        disabled={selectedItems.size === 0}
                        className="bg-gray-900 text-white hover:bg-black px-4 sm:px-5 text-xs py-2 font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mua hàng ({selectedItems.size})
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
