import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import { useIsLoggedIn } from '../../hooks/useAuth';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage: React.FC = () => {
  usePageTitle('Blog | Fitness Mart');
  
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

  const posts = [
    {
      id: 1,
      title: 'Cách Bắt Đầu Tập Gym Cho Người Mới Bắt Đầu',
      excerpt: 'Hướng dẫn đầy đủ cho những ai muốn bắt đầu tập luyện tại phòng gym.',
      author: 'Nguyễn Văn A',
      date: '15 Tháng 3, 2026',
      category: 'Fitness Tips',
      image: 'https://placehold.co/600x600',
    },
    {
      id: 2,
      title: '10 Bài Tập Cardio Tốt Nhất Để Giảm Cân',
      excerpt: 'Tìm hiểu về những bài tập cardio hiệu quả nhất để đốt calo và giảm cân nhanh.',
      author: 'Trần Thị B',
      date: '12 Tháng 3, 2026',
      category: 'Weight Loss',
      image: 'https://placehold.co/600x600',
    },
    {
      id: 3,
      title: 'Chế Độ Dinh Dưỡng Cho Người Tập Gym',
      excerpt: 'Hướng dẫn chi tiết về dinh dưỡng và chế độ ăn uống phù hợp với tập luyện.',
      author: 'Phạm Văn C',
      date: '10 Tháng 3, 2026',
      category: 'Nutrition',
      image: 'https://placehold.co/600x600',
    },
    {
      id: 4,
      title: 'Lợi Ích Của Yoga Cho Sức Khỏe Tổng Thể',
      excerpt: 'Khám phá những lợi ích tuyệt vời của yoga đối với cơ thể và tâm trí.',
      author: 'Hoàng Thị D',
      date: '8 Tháng 3, 2026',
      category: 'Wellness',
      image: 'https://placehold.co/600x600',
    },
    {
      id: 5,
      title: 'Bổ Sung Protein: Nên Hay Không Nên?',
      excerpt: 'Phân tích chi tiết về việc sử dụng bổ sung protein và tác dụng của chúng.',
      author: 'Võ Văn E',
      date: '5 Tháng 3, 2026',
      category: 'Supplements',
      image: 'https://placehold.co/600x600',
    },
    {
      id: 6,
      title: 'Program Tập Luyện 12 Tuần Cho Người Mới',
      excerpt: 'Kế hoạch tập luyện toàn diện trong 12 tuần cho những người mới bắt đầu.',
      author: 'Lê Thị F',
      date: '1 Tháng 3, 2026',
      category: 'Workout Plans',
      image: 'https://placehold.co/600x600',
    },
  ];

  const categoryFilters = ['Tất Cả', 'Fitness Tips', 'Weight Loss', 'Nutrition', 'Wellness', 'Supplements', 'Workout Plans'];

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
              Blog Fitness Mart
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các bài viết hữu ích về fitness, dinh dưỡng, và sức khỏe từ các chuyên gia
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categoryFilters.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  category === 'Tất Cả'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48 bg-gray-200">
                  <img
                    src={post.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all text-sm">
                      Đọc thêm
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-blue-50 p-8 rounded-lg text-center border border-blue-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Đăng Ký Nhận Bài Viết Mới</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Nhận những bài viết mới nhất về fitness, dinh dưỡng và sức khỏe trực tiếp vào hộp thư của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium whitespace-nowrap">
                Đăng Ký
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
