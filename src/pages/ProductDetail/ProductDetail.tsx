import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ProductSkeleton from '../../components/loading/ProductSkeleton';
import { useCategories } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import productService from '../../services/productService';
import type { Product } from '../../types/product';

/**
 * Product Detail Page - Display full product information with reviews
 */
const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePageTitle('Product Detail | Fitness Mart');
  useScrollReset([productId]);

  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Get authentication status

  // Mock state for header

  const cartCount = 3;

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

  const handleAddToCart = (id: string, quantity: number) => {
    console.log(`Added ${quantity} of product ${id} to cart`);
    // TODO: Implement add to cart logic
  };

  const handleBuyNow = (id: string, quantity: number) => {
    console.log(`Buy now: ${quantity} of product ${id}`);
    // TODO: Implement buy now logic
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };



  const handleCategoryPageChange = (page: number) => {
    setCategoryPage(page);
  };

  if (error && !product) {
    return (
      <Layout
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        cartCount={cartCount}
        onCartClick={handleCartClick}
        currentCategoryPage={categoryPagination.page}
        itemsPerPage={categoryPagination.limit}
        totalCategoryPages={categoryPagination.totalPages || 1}
        onCategoryPageChange={handleCategoryPageChange}
      >
        <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 lg:py-16">
          <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div className="text-center py-8 sm:py-12">
              <p className="text-base sm:text-lg text-gray-600">{error}</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={cartCount}
      onCartClick={handleCartClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 lg:py-16">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-4 sm:mb-6 md:mb-8 group text-sm sm:text-base"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Product Images */}
            <motion.div
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-lg animate-pulse" />
              ) : product?.images && product.images.length > 0 ? (
                <motion.img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-cover bg-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : (
                <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm sm:text-base">No image available</span>
                </div>
              )}
              {/* Thumbnail Images */}
              {!isLoading && product?.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <motion.img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-16 sm:h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <ProductSkeleton count={1} />
              ) : product ? (
                <ProductInfo
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ) : null}
            </motion.div>
          </div>

          {/* Product Tabs */}
          <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            {isLoading ? (
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            ) : product ? (
              <ProductTabs product={product} />
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
