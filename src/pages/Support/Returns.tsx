import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ReturnsPage: React.FC = () => {
  usePageTitle('Trả Hàng | Fitness Mart');
  
  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Mock state for header
  const [wishlistCount] = React.useState(5);
  const cartCount = 3;
  const { isLoggedIn } = useIsLoggedIn();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryPage(page);
  };

  const returnsProcess = [
    {
      step: 1,
      title: 'Liên Hệ Hỗ Trợ',
      description: 'Gửi yêu cầu trả hàng trong vòng 30 ngày nhận sản phẩm',
      icon: <CheckCircle size={24} />,
    },
    {
      step: 2,
      title: 'Xác Nhận',
      description: 'Chúng tôi sẽ xác nhận và cung cấp mã trả hàng',
      icon: <Clock size={24} />,
    },
    {
      step: 3,
      title: 'Gửi Lại',
      description: 'Gửi sản phẩm lại với mã trả hàng không tính phí',
      icon: <CheckCircle size={24} />,
    },
    {
      step: 4,
      title: 'Hoàn Tiền',
      description: 'Nhận hoàn tiền trong vòng 7-10 ngày làm việc',
      icon: <CheckCircle size={24} />,
    },
  ];

  const returnConditions = [
    'Sản phẩm còn nguyên vẹn, chưa sử dụng hoặc sử dụng nhẹ',
    'Có tất cả các bao bì, hướng dẫn sử dụng ban đầu',
    'Không có dấu hiệu hư hỏng hoặc mất mát',
    'Trong vòng 30 ngày kể từ ngày mua hàng',
    'Có biên lai hoặc hóa đơn mua hàng',
  ];

  const notReturnable = [
    'Sản phẩm đã sử dụng hoặc có dấu hiệu sử dụng rõ rệt',
    'Sản phẩm hư hỏng do lỗi của khách hàng',
    'Mất hoặc không còn bao bì, tài liệu gốc',
    'Quá 30 ngày kể từ ngày mua',
    'Sản phẩm đặc biệt (áp dụng cho các loại khác)',
  ];

  return (
    <Layout
      categories={categories}
      isLoadingCategories={isLoadingCategories}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isUserLoggedIn={isLoggedIn}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-white py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Chính Sách Trả Hàng & Hoàn Tiền
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết sự hài lòng của khách hàng. Nếu không hài lòng, bạn có thể trả hàng dễ dàng
            </p>
          </motion.div>

          {/* Returns Process */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quy Trình Trả Hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {returnsProcess.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200 h-full flex flex-col items-center">
                    <div className="flex justify-center mb-4 text-gray-900">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Bước {item.step}</h3>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {index < returnsProcess.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-gray-300 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Return Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 p-8 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={24} className="text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Có Thể Trả Hàng</h3>
              </div>
              <ul className="space-y-3">
                {returnConditions.map((condition, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-red-50 p-8 rounded-lg border border-red-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={24} className="text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Không Thể Trả Hàng</h3>
              </div>
              <ul className="space-y-3">
                {notReturnable.map((item, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-red-600 font-bold">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 p-8 rounded-lg border border-blue-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Bổ Sung</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Phí Vận Chuyển:</strong> Chúng tôi sẽ cấp mã trả hàng miễn phí cho bạn. Bạn có thể sử dụng dịch vụ vận chuyển của chúng tôi miễn phí hoặc sử dụng nhà cung cấp vận chuyển của riêng bạn.
              </p>
              <p className="text-gray-700">
                <strong>Thời Gian Xử Lý:</strong> Đơn trả hàng sẽ được xử lý trong vòng 3-5 ngày làm việc kể từ khi chúng tôi nhận được.
              </p>
              <p className="text-gray-700">
                <strong>Hoàn Tiền:</strong> Hoàn tiền sẽ được khoá vào tài khoản ngân hàng của bạn trong vòng 7-10 ngày làm việc (tùy thuộc vào ngân hàng của bạn).
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ReturnsPage;
