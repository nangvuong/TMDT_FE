import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Edit2, AlertCircle, MapPin, Check, CreditCard, Truck, Coins, ShoppingCart, MessageSquare } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import Textarea from '../../components/common/Textarea/Textarea';
import { Modal } from '../../components/common/Modal';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useAddresses } from '../../hooks/useAddresses';
import { useCoupon } from '../../hooks/useCoupon';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';
import { formatPrice } from '../../utils/formatPrice';
import type { CreateAddressDto } from '../../types';

type PaymentMethod = 'bank_transfer' | 'cod';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng (VietQR)' },
  { value: 'cod', label: 'Thanh toán khi nhận hàng' },
];

/**
 * Checkout Page - Complete order and process payment
 */
const Checkout: React.FC = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useIsLoggedIn();
  const alert = useAlert();
  usePageTitle('Checkout | Fitness Mart');
  useScrollReset();

  // Cart & Order
  const { cartItems, removeItem } = useCart();
  const { checkout, error: orderError } = useOrders();

  // Addresses
  const { addresses, fetchAddresses, loading: addressLoading, createAddress, deleteAddress } = useAddresses();

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Address Modal State
  const [isShowingAddressModal, setIsShowingAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<CreateAddressDto>({
    street: '',
    city: '',
    state: '',
    isDefault: false,
  });

  // Helper to reset address form
  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm({ street: '', city: '', state: '', isDefault: false });
  };

  // Helper to open address modal
  const openAddressModal = () => setIsShowingAddressModal(true);

  // Helper to close address modal
  const closeAddressModal = () => {
    setIsShowingAddressModal(false);
    resetAddressForm();
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item.product?.price === 'string' ? parseFloat(item.product.price) : (item.product?.price || 0);
    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  // Coupon hook - calculate discount dynamically based on totalPrice
  const { coupon, discount, isLoading: isCouponLoading, error: couponError, validateCoupon, clearCoupon, isCouponApplied } = useCoupon(totalPrice);

  // Initialize coupon from location state - auto apply when navigating from Cart
  useEffect(() => {
    (async () => {
      const state = location.state as any;
      if (state?.couponCode) {
        setCouponCode(state.couponCode);
        await validateCoupon(state.couponCode);
      }
    })();
  }, [location.state, validateCoupon]);



  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Fetch addresses
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Auto-select first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      setSelectedAddressId(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  /**
   * Validate address form
   */
  const validateAddressForm = (): boolean => {
    if (!addressForm.street || !addressForm.city) {
      alert.showError('Lỗi', 'Vui lòng điền đầy đủ thông tin địa chỉ');
      return false;
    }
    return true;
  };

  /**
   * Handle adding/editing address
   */
  const handleAddAddress = async () => {
    if (!validateAddressForm()) return;

    try {
      const newAddr = await createAddress(addressForm);
      if (newAddr) {
        alert.showSuccess('Thành công', editingAddressId ? 'Địa chỉ đã được cập nhật' : 'Địa chỉ đã được thêm');
        closeAddressModal();
        setSelectedAddressId(newAddr.id);
      }
    } catch (err) {
      alert.showError('Lỗi', 'Không thể cập nhật địa chỉ. Vui lòng thử lại!');
    }
  };

  /**
   * Handle editing address
   */
  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      isDefault: addr.isDefault,
    });
    openAddressModal();
  };

  /**
   * Handle deleting address
   */
  const handleDeleteAddress = async (addressId: string) => {
    alert.showWarning(
      'Xóa địa chỉ',
      'Bạn có chắc muốn xóa địa chỉ này?',
      async () => {
        try {
          const success = await deleteAddress(addressId);
          if (success) {
            alert.showSuccess('Thành công', 'Địa chỉ đã được xóa');
            if (selectedAddressId === addressId) {
              const remaining = addresses.filter(a => a.id !== addressId);
              if (remaining.length > 0) {
                setSelectedAddressId(remaining[0].id);
              }
            }
          }
        } catch (err) {
          alert.showError('Lỗi', 'Không thể xóa địa chỉ. Vui lòng thử lại!');
        }
      }
    );
  };

  /**
   * Handle removing item from cart
   */
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      alert.showError('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại!');
    }
  };

  /**
   * Create order from cart
   */
  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      alert.showWarning('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await checkout({
        shippingAddress: selectedAddressId,
        couponCode: coupon?.code || undefined,
        notes: notes || undefined,
      });

      if (order) {
        // Redirect based on payment method
        if (paymentMethod === 'cod') {
          // COD: redirect to order detail
          setTimeout(() => {
            navigate(`/orders/${order.id}`, { replace: true });
          }, 2000);
        } else {
          // Bank transfer: redirect to payment page
          navigate('/payment', {
            state: {
              orderId: order.id,
              amount: totalPrice - discount,
              paymentMethod: paymentMethod,
            },
            replace: true,
          });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert.showError('Lỗi', 'Tạo đơn hàng thất bại');
    } finally {
      setIsProcessing(false);
    }
  };





  /**
   * Handle applying coupon code
   */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }
    await validateCoupon(couponCode);
  };

  /**
   * Handle clearing coupon code
   */
  const handleClearCoupon = () => {
    setCouponCode('');
    clearCoupon();
  };



  // Checkout form
  return (
    <Layout hideFAB>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-4 md:py-8 lg:py-16">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 pb-56 md:pb-30">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium mb-6 sm:mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Cart Items Section */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                Sản phẩm trong giỏ hàng ({cartItems.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="p-3 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden flex gap-3">
                      {item.product?.images?.[0] && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100 truncate">{item.product?.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {formatPrice(typeof item.product?.price === 'string' ? parseFloat(item.product.price) : item.product?.price || 0)} x {item.quantity || 1}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice((typeof item.product?.price === 'string' ? parseFloat(item.product.price) : item.product?.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                      {item.product?.images?.[0] && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{item.product?.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {formatPrice(typeof item.product?.price === 'string' ? parseFloat(item.product.price) : item.product?.price || 0)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-center min-w-[80px]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Số lượng</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.quantity || 1}</p>
                      </div>
                      <div className="flex-shrink-0 text-center min-w-[100px]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Thành tiền</p>
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice((typeof item.product?.price === 'string' ? parseFloat(item.product.price) : item.product?.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  Giỏ hàng trống
                </div>
              )}
            </div>
          </motion.div>

          {/* Delivery Address Section */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Địa chỉ giao hàng</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddressModal}
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Thêm mới</span>
              </Button>
            </div>
            <div className="p-4 md:p-6">
              {addressLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin">
                    <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-gray-500 dark:text-gray-400">Đang tải địa chỉ...</p>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((addr, index) => (
                    <motion.div
                      key={addr.id}
                      className={`group relative flex items-start gap-3 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedAddressId === addr.id
                          ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800 shadow-md shadow-gray-200 dark:shadow-gray-900/30'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                      }`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      {/* Selection Indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {selectedAddressId === addr.id ? (
                          <motion.div
                            className="w-5 h-5 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <Check className="w-3 h-3 text-white dark:text-gray-900" />
                          </motion.div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500 group-hover:border-gray-500 dark:group-hover:border-gray-400 transition-colors" />
                        )}
                      </div>

                      {/* Address Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">{addr.street}</h3>
                          {addr.isDefault && (
                            <motion.span
                              className="ml-2 px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-full flex-shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              ✓ Mặc định
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {addr.city} {addr.state && `• ${addr.state}`}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          className="p-2 text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 md:py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Chưa có địa chỉ nào</p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs mb-4">
                    Hãy thêm địa chỉ giao hàng để tiếp tục thanh toán
                  </p>
                  <Button
                    onClick={openAddressModal}
                    className="bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm địa chỉ
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Notes Section */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Ghi chú</h2>
            </div>
            <div className="p-4 md:p-6">
              <Textarea
                placeholder="Nhập ghi chú cho đơn hàng"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                inputSize="md"
              />
            </div>
          </motion.div>

          {/* Payment Method Section */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Coins className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">Phương thức thanh toán</h2>
            </div>
            <div className="p-4 md:p-6 space-y-3">
              {PAYMENT_METHODS.map((method, index) => (
                <motion.div
                  key={method.value}
                  className={`group flex items-center gap-3 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.value
                      ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800 shadow-md shadow-gray-200 dark:shadow-gray-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                >
                  {paymentMethod === method.value ? (
                    <motion.div
                      className="w-5 h-5 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center flex-shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Check className="w-3 h-3 text-white dark:text-gray-900" />
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500 group-hover:border-gray-500 dark:group-hover:border-gray-400 flex-shrink-0 transition-colors" />
                  )}
                  {method.value === 'bank_transfer' ? (
                    <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                  ) : (
                    <Truck className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium flex-1">{method.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Checkout Summary Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/30"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-0">
          {/* Row 1: Coupon Code */}
          <div className="space-y-2 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
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
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-2 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-700 dark:text-green-300 font-medium truncate">
                      Mã: <span className="font-bold">{coupon?.code}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearCoupon}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-red-600 dark:hover:text-red-400 whitespace-nowrap ml-2 underline"
                >
                  Xóa
                </button>
              </div>
            )}
            {couponError && (
              <motion.div
                className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-800"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-red-700 dark:text-red-300 leading-tight">{couponError}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Row 2: Items Count, Address Status & Price Summary & Checkout */}
          <div className="py-2 sm:py-3">
            {/* Row 2a: Items & Address (Mobile stacked, Desktop horizontal) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-0 sm:pb-2 sm:border-b sm:border-gray-200 dark:sm:border-gray-700">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs sm:text-sm flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Sản phẩm:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{cartItems.length}</span>
                </div>

                <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>

                <div className="text-xs sm:text-sm w-full sm:w-auto">
                  {selectedAddressId ? (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-green-600 dark:text-green-400">✓</span> {addresses.find(a => a.id === selectedAddressId)?.city}
                    </p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400 font-medium">Chưa chọn địa chỉ</p>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2b: Price Breakdown & Checkout (Compact) */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 pt-2 sm:pt-0">
              {/* Price Summary */}
              <div className="text-xs sm:text-sm space-y-1 flex-1">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(totalPrice)}</span>
                </div>
                {isCouponApplied && discount > 0 && (
                  <div className="flex justify-between gap-4 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                    <span className="text-green-700 dark:text-green-300">Giảm giá:</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-1">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Tổng:</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatPrice(totalPrice - discount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCreateOrder}
                disabled={isProcessing || !selectedAddressId}
                className="bg-gray-900 text-white hover:bg-black px-4 sm:px-6 text-xs sm:text-sm py-2 font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>
            </div>
          </div>

          {orderError && (
            <motion.div
              className="border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-3 sm:px-4 md:px-6 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{orderError}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isShowingAddressModal}
        onClose={closeAddressModal}
        title={editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={closeAddressModal}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddAddress}
              isLoading={isProcessing}
            >
              {editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Đường/Phố"
            placeholder="Nhập đường/phố"
            required
            value={addressForm.street}
            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
          />

          <Input
            label="Thành phố"
            placeholder="Nhập thành phố"
            required
            value={addressForm.city}
            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
          />
          <Input
            label="Tỉnh"
            placeholder="Nhập tỉnh"
            value={addressForm.state}
            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Đặt làm địa chỉ mặc định</span>
          </label>
        </div>
      </Modal>
    </Layout>
  );
};

export default Checkout;
