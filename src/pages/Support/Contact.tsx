import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCategories } from '../../hooks/useProduct';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useIsLoggedIn } from '../../hooks/useAuth';

const ContactPage: React.FC = () => {
  usePageTitle('Liên Hệ | Fitness Mart');
  
  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  const { isLoggedIn } = useIsLoggedIn();

  // Mock state for header
  const [wishlistCount] = useState(5);
  const cartCount = 3;
  

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.');
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Điện Thoại',
      value: '+84 (0)123 456 789',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      value: 'support@fitnessmart.vn',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Địa Chỉ',
      value: '123 Đường ABC, Quận 1, TP.HCM',
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
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng trả lời các câu hỏi của bạn và hỗ trợ bất cứ lúc nào
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4 text-gray-900">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Thông Điệp Cho Chúng Tôi</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  placeholder="Tên của bạn"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                type="tel"
                placeholder="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                type="text"
                placeholder="Chủ đề"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                placeholder="Thông điệp của bạn"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <Button type="submit" fullWidth>
                Gửi Thông Điệp
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
