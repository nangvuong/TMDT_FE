import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useCart } from '../../hooks/useCart';
import { useAlert } from '../../contexts/AlertContext';
import productService from '../../services/productService';
import type { Product } from '../../types/product';
import RecommendedProducts from '../../components/product/RecommendedProducts';

/**
 * Product Detail Page - Display full product information with reviews
 */
const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const alert = useAlert();
  const { addItem: addToCart, isLoading: isAddingToCart, cartItems, removeItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  usePageTitle('Product Detail | Fitness Mart');
  useScrollReset([productId]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await productService.getById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [productId]);

  const handlePrevImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product?.images && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = async (id: string, quantity: number) => {
    try {
      await addToCart(id, quantity);
      // Optional: Show success message
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleBuyNow = async (id: string, quantity: number) => {
    alert.showWarning(
      'Xóa sản phẩm khác',
      'Sản phẩm khác trong giỏ hàng sẽ bị xóa. Chỉ giữ lại sản phẩm này. Tiếp tục?',
      async () => {
        try {
          // Remove other items from cart
          for (const item of cartItems) {
            if (item.product?.id !== id) {
              await removeItem(item.id);
            }
          }
          // Add this product
          await addToCart(id, quantity);
          // Navigate to checkout
          navigate('/checkout');
        } catch (err) {
          console.error('Failed to proceed to checkout:', err);
          alert.showError('Lỗi', 'Không thể xử lý. Vui lòng thử lại!');
        }
      },
      { confirmText: 'Mua ngay', cancelText: 'Hủy' }
    );
  };

  if (error && !product) {
    return (
      <Layout>
        <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-16">
          <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div className="text-center py-16 sm:py-24">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 sm:p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">😕</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Xem sản phẩm khác
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const images = product?.images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <Layout>
      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && product && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 md:py-8 lg:py-12">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mb-8">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium mb-4 sm:mb-6 group text-sm sm:text-base"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Product Detail Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/30 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Product Images */}
              <motion.div
                className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative group">
                      <motion.div
                        className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-900 cursor-zoom-in"
                        onClick={() => setIsZoomed(true)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={selectedImageIndex}
                            src={images[selectedImageIndex]}
                            alt={product?.name}
                            className="w-full h-full object-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </AnimatePresence>
                        {/* Zoom indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-900/90 p-3 rounded-full shadow-lg">
                            <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Navigation Arrows */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
                          >
                            <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Images */}
                    {hasMultipleImages && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 sm:gap-3">
                        {images.map((image, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex === index
                                ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20'
                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img
                              src={image}
                              alt={`${product?.name} ${index + 1}`}
                              className="w-full h-full object-cover bg-white dark:bg-gray-900"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📷</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Không có hình ảnh</span>
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                className="p-4 sm:p-6 lg:p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? (
                  <ProductSkeleton count={1} />
                ) : product ? (
                  <ProductInfo
                    product={product}
                    isLoading={isAddingToCart}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ) : null}
              </motion.div>
            </div>
          </div>

          {/* Product Tabs */}
          <motion.div 
            className="mt-6 sm:mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ) : product ? (
                <ProductTabs product={product} />
              ) : null}
            </div>
          </motion.div>
        </div>
        {/* Recommended Products */}
          {product && (
            <RecommendedProducts
              productId={product.id}
              limit={8}
              onProductClick={(id) => navigate(`/products/${id}`)}
            />
          )}
      </section>
    </Layout>
  );
};

export default ProductDetail;
