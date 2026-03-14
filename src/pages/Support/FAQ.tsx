import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { ChevronDown } from 'lucide-react';

const FAQPage: React.FC = () => {
  usePageTitle('Câu Hỏi Thường Gặp | Fitness Mart');
  
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

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'Làm thế nào để đặt hàng?',
      answer: 'Bạn có thể đặt hàng bằng cách duyệt các sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Chúng tôi chấp nhận các phương thức thanh toán: thẻ tín dụng, chuyển khoản ngân hàng và ví điện tử.',
    },
    {
      id: '2',
      question: 'Bao lâu thì tôi sẽ nhận hàng?',
      answer: 'Thời gian giao hàng tiêu chuẩn là 3-5 ngày làm việc. Nếu bạn chọn giao hàng nhanh, sản phẩm sẽ đến trong 1-2 ngày làm việc. Thời gian có thể khác nhau tùy thuộc vào vị trí của bạn.',
    },
    {
      id: '3',
      question: 'Có miễn phí vận chuyển không?',
      answer: 'Có, chúng tôi cung cấp miễn phí vận chuyển cho các đơn hàng từ 1,000,000đ trở lên. Với đơn hàng dưới 500,000đ, phí vận chuyển là 19,000đ. Từ 500,000 - 999,999đ, phí vận chuyển là 9,000đ.',
    },
    {
      id: '4',
      question: 'Tôi có thể trả hàng nếu không hài lòng không?',
      answer: 'Có thể! Bạn có quyền trả hàng trong vòng 30 ngày kể từ ngày mua nếu sản phẩm còn nguyên vẹn. Chi phí vận chuyển trả hàng sẽ được Fitness Mart thanh toán.',
    },
    {
      id: '5',
      question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
      answer: 'Sau khi đặt hàng, bạn sẽ nhận được mã theo dõi qua email. Bạn có thể sử dụng mã này để theo dõi vị trí của gói hàng trên trang web của chúng tôi hoặc liên hệ với hỗ trợ khách hàng.',
    },
    {
      id: '6',
      question: 'Tôi có thể hủy đơn hàng không?',
      answer: 'Bạn có thể hủy đơn hàng nếu nó chưa được xử lý để giao hàng. Một khi đơn hàng đã được gửi đi, bạn sẽ cần sử dụng dịch vụ trả hàng của chúng tôi.',
    },
    {
      id: '7',
      question: 'Phương thức thanh toán nào mà bạn chấp nhận?',
      answer: 'Chúng tôi chấp nhận: thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay) và thanh toán khi nhận hàng (COD).',
    },
    {
      id: '8',
      question: 'Có bảo hành cho sản phẩm không?',
      answer: 'Các sản phẩm điện tử và máy móc có bảo hành từ 6 tháng đến 1 năm tùy loại sản phẩm. Chi tiết bảo hành sẽ được cung cấp khi giao hàng. Vui lòng liên hệ hỗ trợ khách hàng để biết chi tiết.',
    },
    {
      id: '9',
      question: 'Tôi có thể liên hệ hỗ trợ khách hàng như thế nào?',
      answer: 'Bạn có thể liên hệ chúng tôi qua: điện thoại (+84 123 456 789), email (support@fitnessmart.vn) hoặc thông qua biểu mẫu liên hệ trên trang web. Thời gian hỗ trợ: Thứ 2 - Thứ 7, 8:00 - 18:00.',
    },
    {
      id: '10',
      question: 'Các sản phẩm có khuyến mãi hoặc giảm giá không?',
      answer: 'Có! Chúng tôi thường xuyên có các đợt khuyến mãi và giảm giá. Bạn có thể theo dõi các ưu đãi trên trang chủ hoặc đăng ký nhận thông báo các khuyến mãi sắp tới.',
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-xl text-gray-600">
              Tìm câu trả lời cho các câu hỏi phổ biến của bạn
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="text-gray-600" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border-t border-gray-200"
                    >
                      <p className="px-6 py-4 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-blue-50 p-8 rounded-lg text-center border border-blue-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy câu trả lời?
            </h3>
            <p className="text-gray-700 mb-6">
              Hãy liên hệ với đội hỗ trợ khách hàng của chúng tôi để được trợ giúp
            </p>
            <a
              href="/support/contact"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
            >
              Liên Hệ Hỗ Trợ
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
