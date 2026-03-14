import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';

const PrivacyPage: React.FC = () => {
  usePageTitle('Chính Sách Bảo Mật | Fitness Mart');
  
  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Mock state for header
  const [wishlistCount] = useState(5);
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

  const sections = [
    {
      title: '1. Giới Thiệu',
      content: `Fitness Mart ("chúng tôi", "công ty", "chúng ta") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn.`,
    },
    {
      title: '2. Thông Tin Chúng Tôi Thu Thập',
      content: `Chúng tôi có thể thu thập thông tin sau từ bạn:
      - Thông tin cá nhân (tên, email, số điện thoại, địa chỉ)
      - Thông tin thanh toán (số thẻ tín dụng, thông tin ngân hàng)
      - Thông tin sử dụng website (địa chỉ IP, loại trình duyệt, trang được truy cập)
      - Thông tin tương tác (các tin nhắn bạn gửi cho chúng tôi)`,
    },
    {
      title: '3. Cách Chúng Tôi Sử Dụng Thông Tin',
      content: `Chúng tôi sử dụng thông tin để:
      - Xử lý đơn hàng và giao hàng
      - Cải thiện dịch vụ và website
      - Gửi thông báo về đơn hàng
      - Phản hồi các yêu cầu của bạn
      - Ngăn chặn gian lận
      - Tuân thủ các yêu cầu pháp lý`,
    },
    {
      title: '4. Bảo Mật Dữ Liệu',
      content: `Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn trong ngành để bảo vệ thông tin cá nhân của bạn. Tuy nhiên, không có phương pháp truyền trên Internet hoặc lưu trữ điện tử nào là 100% an toàn. Chúng tôi không thể đảm bảo bảo mật tuyệt đối.`,
    },
    {
      title: '5. Chia Sẻ Thông Tin',
      content: `Chúng tôi có thể chia sẻ thông tin của bạn với:
      - Nhà cung cấp dịch vụ vận chuyển
      - Nhà cung cấp thanh toán
      - Các công ty phân tích
      - Các bên thứ ba khi được pháp luật yêu cầu`,
    },
    {
      title: '6. Cookies',
      content: `Website của chúng tôi sử dụng cookies để ghi nhớ thông tin của bạn. Bạn có thể tắt cookies trong cài đặt trình duyệt của bạn, nhưng điều này có thể ảnh hưởng đến chức năng website.`,
    },
    {
      title: '7. Quyền Của Bạn',
      content: `Bạn có quyền:
      - Truy cập dữ liệu cá nhân của bạn
      - Yêu cầu sửa đổi dữ liệu không chính xác
      - Yêu cầu xóa dữ liệu của bạn
      - Từ chối quảng cáo qua email
      - Rút lại sự đồng ý bất cứ lúc nào`,
    },
    {
      title: '8. Liên Hệ Với Chúng Tôi',
      content: `Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
      Email: privacy@fitnessmart.vn
      Điện thoại: +84 (0)123 456 789
      Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM`,
    },
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
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-gray-600">
              Chính sách này có hiệu lực từ ngày 1 Tháng 1, 2024
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Last Update */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm"
          >
            <p>Cập nhật lần cuối: 14 Tháng 3, 2026</p>
            <p className="mt-2">
              Chúng tôi có quyền cập nhật chính sách này bất cứ lúc nào. Vui lòng kiểm tra thường xuyên để biết các thay đổi.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-blue-50 p-8 rounded-lg text-center border border-blue-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Câu Hỏi Về Bảo Mật?</h3>
            <p className="text-gray-700 mb-6">
              Chúng tôi sẵn sàng trả lời bất cứ câu hỏi nào về cách chúng tôi bảo vệ dữ liệu của bạn.
            </p>
            <a
              href="/support/contact"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
            >
              Liên Hệ Chúng Tôi
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;
