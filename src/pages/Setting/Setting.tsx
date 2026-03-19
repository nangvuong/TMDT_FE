import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, Globe, User, LogOut } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import Select from '../../components/common/Select/Select';
import { useCategories } from '../../hooks/useProduct';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useIsLoggedIn, useLogout } from '../../hooks/useAuth';

/**
 * Setting Page - User settings and preferences
 */
const Setting: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { isLoggedIn } = useIsLoggedIn();

  usePageTitle('Cài đặt | Fitness Mart');
  useScrollReset([]);

  // Fetch categories for header
  const {
    categories,
    isLoading: isLoadingCategories,
    pagination: categoryPagination,
    setPage: setCategoryPage,
  } = useCategories({ page: 1, limit: 6 });

  // Mock state for header

  const cartCount = 3;

  // Settings state
  const [email, setEmail] = useState('user@example.com');
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState('0123456789');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: true,
  });

  const [language, setLanguage] = useState('vi');
  const [theme, setTheme] = useState('light');

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      // TODO: Implement API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage({ type: 'success', text: 'Lưu thông tin thành công!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại!' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSaveMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSaveMessage({
        type: 'error',
        text: 'Mật khẩu mới không khớp!',
      });
      return;
    }

    if (newPassword.length < 6) {
      setSaveMessage({
        type: 'error',
        text: 'Mật khẩu phải có ít nhất 6 ký tự!',
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage(null);
      // TODO: Implement API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage({
        type: 'success',
        text: 'Đổi mật khẩu thành công!',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Có lỗi xảy ra, vui lòng thử lại!',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      // TODO: Implement API call to save notifications
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage({
        type: 'success',
        text: 'Lưu cài đặt thông báo thành công!',
      });
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Có lỗi xảy ra, vui lòng thử lại!',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryPage(page);
  };

  if (!isLoggedIn) {
    return (
      <Layout
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        cartCount={cartCount}
        onCartClick={() => navigate('/cart')}
        currentCategoryPage={categoryPagination.page}
        itemsPerPage={categoryPagination.limit}
        totalCategoryPages={categoryPagination.totalPages || 1}
        onCategoryPageChange={handleCategoryPageChange}
      >
        <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-16 min-h-screen">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">Vui lòng đăng nhập để truy cập cài đặt</p>
              <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
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
      onCartClick={() => navigate('/cart')}
      currentCategoryPage={categoryPagination.page}
      itemsPerPage={categoryPagination.limit}
      totalCategoryPages={categoryPagination.totalPages || 1}
      onCategoryPageChange={handleCategoryPageChange}
    >
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-8 md:py-16 min-h-screen pb-20 md:pb-8">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium mb-8 group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </motion.button>

          {/* Page Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Cài đặt
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="h-1 w-12 bg-gradient-to-r from-gray-900 to-transparent rounded-full" />
              <p>Quản lý thông tin cá nhân và tùy chọn của bạn</p>
            </div>
          </motion.div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              className={`mb-8 p-4 rounded-xl border-l-4 flex items-start gap-3 ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 border-l-green-500 text-green-900'
                  : 'bg-red-50 border-l-red-500 text-red-900'
              }`}
              initial={{ opacity: 0, y: -10, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
            >
              <div className="mt-0.5">
                {saveMessage.type === 'success' ? '✓' : '⚠'}
              </div>
              <p className="font-medium">{saveMessage.text}</p>
            </motion.div>
          )}

          {/* Settings Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Profile Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <User size={28} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật hồ sơ của bạn</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Tên đầy đủ
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập tên đầy đủ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Số điện thoại
                  </label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 font-semibold py-3 rounded-xl"
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Password Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                  <Lock size={28} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Bảo mật</h2>
                  <p className="text-sm text-gray-500 mt-1">Đổi mật khẩu của bạn</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Mật khẩu hiện tại
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Mật khẩu mới
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Xác nhận mật khẩu
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button
                    onClick={handleChangePassword}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 font-semibold py-3 rounded-xl"
                  >
                    {isSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <Bell size={28} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông báo</h2>
                  <p className="text-sm text-gray-500 mt-1">Quản lý thông báo của bạn</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { key: 'email', label: 'Thông báo qua email' },
                  { key: 'sms', label: 'Thông báo qua SMS' },
                  { key: 'push', label: 'Thông báo push' },
                  { key: 'marketing', label: 'Email tiếp thị' },
                ].map((item) => (
                  <motion.div
                    key={item.key}
                    whileHover={{ x: 4 }}
                  >
                    <Checkbox
                      label={item.label}
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: e.target.checked,
                        })
                      }
                      size="md"
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900 font-semibold py-3 rounded-xl"
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Language & Theme Section */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <Globe size={28} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ngôn ngữ & Giao diện</h2>
                  <p className="text-sm text-gray-500 mt-1">Tùy chỉnh trải nghiệm</p>
                </div>
              </div>

              <div className="space-y-5">
                <Select
                  label="Ngôn ngữ"
                  value={language}
                  onChange={(value) => setLanguage(String(value))}
                  options={[
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'en', label: 'English' },
                  ]}
                  fullWidth
                />

                <Select
                  label="Chủ đề"
                  value={theme}
                  onChange={(value) => setTheme(String(value))}
                  options={[
                    { value: 'light', label: 'Sáng' },
                    { value: 'dark', label: 'Tối' },
                  ]}
                  fullWidth
                />

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 mt-6">
                  <p className="text-sm text-purple-900 font-medium">
                    💡 Chủ đề sẽ được áp dụng ngay lập tức
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Logout Section */}
          <motion.div
            className="mt-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-sm border border-red-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl">
                <LogOut size={28} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900">Đăng xuất</h2>
                <p className="text-sm text-red-700 mt-1">Kết thúc phiên làm việc của bạn</p>
              </div>
            </div>

            <p className="text-red-800 font-medium mb-6">
              Bạn sẽ cần đăng nhập lại để truy cập tài khoản của mình
            </p>

            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Đăng xuất ngay
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Setting;
