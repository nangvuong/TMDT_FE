import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { usePayment } from '../../hooks/usePayment';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';
import { formatPrice } from '../../utils/formatPrice';

interface PaymentState {
  orderId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'cod';
}

/**
 * Payment Page - Handle payment processing
 */
const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useIsLoggedIn();
  const alert = useAlert();
  const { createTransaction, checkPayment } = usePayment();

  usePageTitle('Payment | Fitness Mart');
  useScrollReset();

  // State from location
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'expired' | 'cancelled' | 'failed'>('pending');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Get payment state from location
  useEffect(() => {
    const state = location.state as any;
    if (!state?.orderId || !state?.paymentMethod) {
      navigate('/checkout', { replace: true });
      return;
    }
    setPaymentState(state);
  }, [location.state, navigate]);

  // If COD, redirect immediately
  useEffect(() => {
    if (paymentState?.paymentMethod === 'cod') {
      navigate(`/orders/${paymentState.orderId}`, { replace: true });
    }
  }, [paymentState, navigate]);

  // Auto create payment transaction on mount
  useEffect(() => {
    if (paymentState?.orderId && !paymentData) {
      handleCreatePayment();
    }
  }, [paymentState?.orderId]);

  /**
   * Create payment transaction for bank transfer
   */
  const handleCreatePayment = async () => {
    if (!paymentState?.orderId) return;

    try {
      const response = await createTransaction({
        orderId: paymentState.orderId,
        paymentMethod: 'bank_transfer',
      });

      setPaymentData(response);
      setTransactionCode(response.transactionCode);
      // Set loading to false since image may be cached
      setIsImageLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert.showError('Lỗi', 'Tạo QR code thanh toán thất bại');
    }
  };

  /**
   * Check payment status (manual)
   */
  const handleCheckPayment = async () => {
    if (!transactionCode) return;

    try {
      const result = await checkPayment(transactionCode);

      if (result.transaction?.paidAt) {
        setPaymentStatus('completed');
        alert.showSuccess('Thành công', 'Thanh toán đã được xác nhận!');
        setTimeout(() => {
          navigate(`/orders/${paymentState?.orderId}`, { replace: true });
        }, 2000);
      } else if (result.status === 'EXPIRED') {
        setPaymentStatus('expired');
        alert.showWarning('Cảnh báo', 'QR code đã hết hạn');
      } else if (result.status === 'FAILED') {
        setPaymentStatus('failed');
        alert.showError('Lỗi', 'Thanh toán thất bại');
      } else if (result.status === 'CANCELLED') {
        setPaymentStatus('cancelled');
        alert.showWarning('Cảnh báo', 'Thanh toán đã bị hủy');
      } else {
        alert.showWarning('Thông báo', 'Chưa có thanh toán nào');
      }
    } catch (error) {
      console.error('Check payment error:', error);
      alert.showError('Lỗi', 'Kiểm tra thanh toán thất bại');
    }
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert.showSuccess('Thành công', 'Đã sao chép!');
  };

  if (!paymentState || !paymentData) {
    return (
      <Layout>
        <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-6">
          <div className="container mx-auto max-w-2xl px-4">
            <p className="text-center text-gray-500">Đang tải...</p>
          </div>
        </section>
      </Layout>
    );
  }

  // Payment QR code display
  return (
    <Layout hideFAB>
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-6 lg:py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.button
            onClick={() => navigate('/checkout')}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-3 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          <motion.div
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 lg:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
        

            {/* Title - Full width */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-900">Thanh toán VietQR</h1>
              <p className="text-center text-gray-600 text-sm md:text-base">Quét mã QR bằng ứng dụng ngân hàng để hoàn tất thanh toán</p>
            </div>

            {/* Content Grid - QR + Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
              {/* QR Code Section */}
              <div className="flex justify-center">
                {paymentData.qrCodeUrl && (
                  <motion.div
                    className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-3xl inline-block shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                  >
                    {isImageLoading && (
                      <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                        <Clock className="w-12 h-12 text-gray-400 animate-spin" />
                      </div>
                    )}

                    {!isImageLoading && !imageError && (
                      <motion.img
                        src={`${paymentData.qrCodeUrl}?t=${Date.now()}`}
                        alt="QR Code Payment"
                        className="w-64 h-64 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onLoad={() => setIsImageLoading(false)}
                        onError={() => {
                          setIsImageLoading(false);
                          setImageError(true);
                        }}
                      />
                    )}

                    {imageError && (
                      <div className="w-64 h-64 bg-red-50 rounded-2xl flex flex-col items-center justify-center border border-red-200">
                        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                        <p className="text-red-600 font-medium">Không thể tải QR code</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-5">

                {/* Transaction Info */}
                <motion.div
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm font-medium">Mã giao dịch:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-semibold">
                        {paymentData.transactionCode}
                      </code>
                      <motion.button
                        onClick={() => copyToClipboard(paymentData.transactionCode)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Sao chép"
                      >
                        <Copy className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="h-px bg-gray-300" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hạn thanh toán:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.expiredAt ? new Date(paymentData.expiredAt).toLocaleString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                  <div className="h-px bg-gray-300" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentState?.amount ? formatPrice(paymentState.amount) : 'N/A'}
                    </span>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleCheckPayment}
                    disabled={paymentStatus === 'completed' || paymentStatus === 'expired' || paymentStatus === 'failed' || paymentStatus === 'cancelled'}
                    className="w-full py-3 rounded-xl font-semibold text-base"
                    size="lg"
                  >
                    {paymentStatus === 'completed' ? '✓ Thanh toán đã hoàn tất' : 'Kiểm tra lại thanh toán'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Payment;
