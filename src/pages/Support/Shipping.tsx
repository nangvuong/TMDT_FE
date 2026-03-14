import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { Truck, Clock, MapPin } from 'lucide-react';

const ShippingPage: React.FC = () => {
  usePageTitle('Vận Chuyển | Fitness Mart');
  
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

  const shippingMethods = [
    {
      icon: <Truck size={24} />,
      title: 'Giao Hàng Tiêu Chuẩn',
      time: '3-5 ngày làm việc',
      price: 'Miễn phí từ 500,000đ',
      description: 'Vận chuyển an toàn đến bất cứ nơi nào tại Việt Nam',
    },
    {
      icon: <Clock size={24} />,
      title: 'Giao Hàng Nhanh',
      time: '1-2 ngày làm việc',
      price: '29,000đ',
      description: 'Giao hàng nhanh cho những khách hàng vội vàng',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Nhận Tại Cửa Hàng',
      time: 'Cùng ngày',
      price: 'Miễn phí',
      description: 'Lấy đơn hàng tại các cửa hàng của chúng tôi',
    },
  ];

  const shippingRates = [
    { range: 'Dưới 500,000đ', fee: '19,000đ' },
    { range: '500,000 - 1,000,000đ', fee: '9,000đ' },
    { range: 'Từ 1,000,000đ trở lên', fee: 'Miễn phí' },
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
              Vận Chuyển & Giao Hàng
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các tùy chọn vận chuyển linh hoạt với giá cạnh tranh
            </p>
          </motion.div>

          {/* Shipping Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-center mb-4 text-gray-900">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{method.title}</h3>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">{method.time}</p>
                  <p className="text-lg font-semibold text-gray-900">{method.price}</p>
                </div>
                <p className="text-gray-600 text-center text-sm">{method.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Shipping Rates Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-8 rounded-lg mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng Giá Vận Chuyển (Giao Hàng Tiêu Chuẩn)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Giá Trị Đơn Hàng</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Phí Vận Chuyển</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingRates.map((rate, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
                      <td className="py-4 px-4 text-gray-700">{rate.range}</td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">{rate.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Shipping Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cách Thức Tracking</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Nhận mã theo dõi qua email sau khi đơn hàng được xác nhận</li>
                <li>• Cập nhật trạng thái vận chuyển hàng ngày</li>
                <li>• Liên hệ hỗ trợ khách hàng nếu có vấn đề</li>
                <li>• Lưu trữ thông tin đơn hàng trong tài khoản của bạn</li>
              </ul>
            </div>
            <div className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chính Sách Lưu Ý</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Kiểm tra sản phẩm ngay khi nhận hàng</li>
                <li>• Báo cáo thiệt hại trong vòng 24 giờ</li>
                <li>• Vận chuyển khu vực ngoài thành phố có thể mất thêm 2-3 ngày</li>
                <li>• Miễn phí vận chuyển là dành cho khu vực giao hàng tiêu chuẩn</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ShippingPage;
