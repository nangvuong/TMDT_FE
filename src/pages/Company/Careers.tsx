import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { MapPin, DollarSign, ArrowRight } from 'lucide-react';

const CareersPage: React.FC = () => {
  usePageTitle('Sự Nghiệp | Fitness Mart');
  
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

  const jobs = [
    {
      id: 1,
      title: 'Nhân Viên Bán Hàng',
      location: 'TP. Hồ Chí Minh',
      salary: '8 - 12 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Chúng tôi tìm kiếm nhân viên bán hàng nhiệt huyết để phục vụ khách hàng tại shop.',
      postedDate: '15 Tháng 3, 2026',
    },
    {
      id: 2,
      title: 'Chuyên Viên Marketing',
      location: 'Hà Nội',
      salary: '12 - 18 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Cở hội để phát triển kỹ năng marketing và giúp Fitness Mart phát triển.',
      postedDate: '12 Tháng 3, 2026',
    },
    {
      id: 3,
      title: 'Kỹ Sư Phần Mềm',
      location: 'TP. Hồ Chí Minh',
      salary: '18 - 30 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Tham gia xây dựng platform e-commerce mới của Fitness Mart.',
      postedDate: '10 Tháng 3, 2026',
    },
    {
      id: 4,
      title: 'Chuyên Viên Nhân Sự',
      location: 'TP. Hồ Chí Minh',
      salary: '10 - 15 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Tuyển dụng, đào tạo và phát triển nhân lực cho công ty.',
      postedDate: '8 Tháng 3, 2026',
    },
    {
      id: 5,
      title: 'Trưởng Phòng Vận Hành',
      location: 'Đà Nẵng',
      salary: '15 - 22 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Quản lý các hoạt động vận hành tại cửa hàng Đà Nẵng.',
      postedDate: '5 Tháng 3, 2026',
    },
    {
      id: 6,
      title: 'Chuyên Viên Thiết Kế Đồ Họa',
      location: 'TP. Hồ Chí Minh',
      salary: '10 - 16 triệu/tháng',
      type: 'Toàn thời gian',
      description: 'Thiết kế hình ảnh cho các chiến dịch marketing và sản phẩm.',
      postedDate: '1 Tháng 3, 2026',
    },
  ];

  const benefits = [
    'Lương cạnh tranh và thưởng hiệu suất',
    'Môi trường làm việc thân thiện và chuyên nghiệp',
    'Cơ hội đào tạo và phát triển kỹ năng',
    'Bảo hiểm y tế toàn diện',
    'Chế độ nghỉ phép hấp dẫn',
    'Cơ hội thăng tiến trong sự nghiệp',
    'Hoạt động team building thường xuyên',
    'Chế độ làm việc linh hoạt',
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sự Nghiệp Tại Fitness Mart
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gia nhập đội ngũ của chúng tôi và phát triển sự nghiệp trong một môi trường chuyên nghiệp
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-16 bg-blue-50 p-8 rounded-lg border border-blue-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quyền Lợi Nhân Viên</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-600 font-bold text-lg mt-1">✓</span>
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Vị Trí Tuyển Dụng</h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-gray-300 cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
                          {job.type}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          <span>{job.salary}</span>
                        </div>
                        <div className="text-xs">
                          Đăng: {job.postedDate}
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium whitespace-nowrap self-start md:self-center">
                      Ứng Tuyển
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-green-50 p-8 rounded-lg text-center border border-green-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Không Tìm Thấy Vị Trí Phù Hợp?</h3>
            <p className="text-gray-700 mb-6">
              Hãy gửi hồ sơ của bạn cho chúng tôi. Chúng tôi luôn tìm kiếm những tài năng tốt.
            </p>
            <a
              href="mailto:careers@fitnessmart.vn"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
            >
              Gửi Hồ Sơ
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CareersPage;
