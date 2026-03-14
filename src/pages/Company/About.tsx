import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { Target, Heart, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  usePageTitle('Về Chúng Tôi | Fitness Mart');
  
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

  const values = [
    {
      icon: <Target size={24} />,
      title: 'Sứ Mệnh',
      description: 'Cung cấp sản phẩm fitness chất lượng cao để giúp mọi người đạt được mục tiêu sức khỏe của họ',
    },
    {
      icon: <Heart size={24} />,
      title: 'Tầm Nhìn',
      description: 'Trở thành chuỗi cửa hàng fitness hàng đầu tại Việt Nam với dịch vụ tuyệt vời',
    },
    {
      icon: <Zap size={24} />,
      title: 'Giá Trị',
      description: 'Chất lượng, sự trung thực, hỗ trợ khách hàng và cam kết với cộng đồng fitness',
    },
  ];

  const stats = [
    { number: '10+', label: 'Năm Kinh Nghiệm' },
    { number: '50K+', label: 'Khách Hàng Hài Lòng' },
    { number: '10+', label: 'Cửa Hàng' },
    { number: '1000+', label: 'Sản Phẩm' },
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
              Về Fitness Mart
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi hoạt động với niềm tin rằng mọi người đều có quyền tiếp cận các sản phẩm fitness chất lượng cao
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-16 bg-gray-50 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu Chuyện Của Chúng Tôi</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Fitness Mart được thành lập vào năm 2014 với một mục tiêu đơn giản: cung cấp các sản phẩm fitness chất lượng cao
                với giá cạnh tranh cho mọi người ở Việt Nam.
              </p>
              <p>
                Bắt đầu từ một cửa hàng nhỏ, chúng tôi đã phát triển thành một chuỗi cửa hàng với hơn 10 cơ sở tại các thành phố lớn.
                Sự tăng trưởng này là kết quả của sự cam kết của chúng tôi đối với chất lượng, dịch vụ khách hàng và giá cạnh tranh.
              </p>
              <p>
                Ngày nay, chúng tôi tự hào phục vụ hơn 50,000 khách hàng hài lòng với bộ sưu tập hơn 1000 sản phẩm từ các thương hiệu
                hàng đầu trên thế giới.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-gray-50 p-6 rounded-lg"
              >
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Giá Trị Cốt Lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4 text-gray-900">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 p-8 rounded-lg text-center border border-blue-200"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội Ngũ Của Chúng Tôi</h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">
              Fitness Mart tự hào có một đội ngũ gần 200 nhân viên tận tâm, nhiều năm kinh nghiệm trong ngành fitness.
              Mỗi thành viên đều cam kết cung cấp dịch vụ tốt nhất cho khách hàng.
            </p>
            <p className="text-gray-600">
              Với các chuyên gia fitness, nhân viên bán hàng được đào tạo và hỗ trợ khách hàng, chúng tôi đảm bảo
              bạn nhận được tư vấn tốt nhất khi chọn sản phẩm.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
