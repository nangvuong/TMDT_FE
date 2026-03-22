import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Lock, Globe, User, LogOut, MapPin, Plus, Edit, Trash2, Check } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import Select from '../../components/common/Select/Select';
import Modal from '../../components/common/Modal/Modal';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useScrollReset } from '../../hooks/useScrollReset';
import { useIsLoggedIn, useLogout } from '../../hooks/useAuth';
import { useAddresses } from '../../hooks/useAddresses';
import type { Address, CreateAddressDto, UpdateAddressDto } from '../../types';

/**
 * Setting Page - User settings and preferences
 */
const Setting: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { isLoggedIn } = useIsLoggedIn();

  usePageTitle('Cài đặt | Fitness Mart');
  useScrollReset([]);

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

  // Address management state
  const { 
    addresses, 
    loading: addressLoading, 
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    state: '',
    city: '',
    isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMessage, setAddressMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  // Address management handlers
  const openAddressModal = (address?: Address) => {
    if (address) {
      // Edit mode
      setEditingAddressId(address.id);
      setAddressForm({
        street: address.street,
        state: address.state,
        city: address.city,
        isDefault: address.isDefault,
      });
    } else {
      // Add mode
      setEditingAddressId(null);
      setAddressForm({
        street: '',
        state: '',
        city: '',
        isDefault: false,
      });
    }
    setShowAddressModal(true);
    setAddressMessage(null);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddressId(null);
    setAddressForm({
      street: '',
      state: '',
      city: '',
      isDefault: false,
    });
    setAddressMessage(null);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.street.trim() || !addressForm.state.trim() || !addressForm.city.trim()) {
      setAddressMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin địa chỉ!' });
      return;
    }

    try {
      setAddressSaving(true);
      setAddressMessage(null);

      if (editingAddressId) {
        // Update
        const result = await updateAddress(editingAddressId, addressForm as UpdateAddressDto);
        if (result) {
          setAddressMessage({ type: 'success', text: 'Cập nhật địa chỉ thành công!' });
          setTimeout(closeAddressModal, 1000);
        } else {
          setAddressMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật địa chỉ!' });
        }
      } else {
        // Create
        const result = await createAddress(addressForm as CreateAddressDto);
        if (result) {
          setAddressMessage({ type: 'success', text: 'Thêm địa chỉ thành công!' });
          setTimeout(closeAddressModal, 1000);
        } else {
          setAddressMessage({ type: 'error', text: 'Có lỗi xảy ra khi thêm địa chỉ!' });
        }
      }
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      setAddressSaving(true);
      const result = await deleteAddress(id);
      if (result) {
        setAddressMessage({ type: 'success', text: 'Xoá địa chỉ thành công!' });
        setDeleteConfirmId(null);
      } else {
        setAddressMessage({ type: 'error', text: 'Có lỗi xảy ra khi xoá địa chỉ!' });
      }
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setAddressSaving(true);
      await setDefaultAddress(id);
      setAddressMessage({ type: 'success', text: 'Đặt làm địa chỉ mặc định thành công!' });
    } finally {
      setAddressSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout>
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
    <Layout>
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
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2 md:mb-3">
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
                  ? 'bg-gray-100 border-l-gray-600 text-gray-800'
                  : 'bg-gray-50 border-l-gray-600 text-gray-800'
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
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <User size={28} className="text-gray-700" />
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
                    fullWidth
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
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <Lock size={28} className="text-gray-700" />
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
                    fullWidth
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
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <Bell size={28} className="text-gray-700" />
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
                  fullWidth
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
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <Globe size={28} className="text-gray-700" />
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

                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 mt-6">
                  <p className="text-sm text-gray-800 font-medium">
                    💡 Chủ đề sẽ được áp dụng ngay lập tức
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Address Management Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
              <div className="p-2 md:p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <MapPin size={24} className="md:w-7 md:h-7 text-gray-700" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Địa chỉ giao hàng</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">Quản lý địa chỉ nhận hàng của bạn</p>
              </div>
            </div>

            {/* Address Section Container */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Add Address Button */}
              <div className="mb-6 md:mb-8">
                <Button
                  onClick={() => openAddressModal()}
                >
                  Thêm địa chỉ
                </Button>
              </div>

              {/* Address Message */}
              <AnimatePresence>
                {addressMessage && (
                  <motion.div
                    className={`mb-6 p-4 rounded-xl border-l-4 flex items-start gap-3 ${
                      addressMessage.type === 'success'
                        ? 'bg-gray-100 border-l-gray-600 text-gray-800'
                        : 'bg-gray-50 border-l-gray-600 text-gray-800'
                    }`}
                    initial={{ opacity: 0, y: -10, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="mt-0.5 text-lg">
                      {addressMessage.type === 'success' ? '✓' : '⚠'}
                    </div>
                    <p className="font-medium">{addressMessage.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Address List */}
              {addressLoading ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-600 font-medium">Đang tải địa chỉ...</p>
                </motion.div>
              ) : addresses.length === 0 ? (
                <motion.div
                  className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 md:p-12 text-center border border-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <MapPin size={40} className="md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Chưa có địa chỉ nào</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">Thêm địa chỉ giao hàng đầu tiên của bạn</p>
                  <Button
                    onClick={() => openAddressModal()}
                  >
                    Thêm địa chỉ đầu tiên
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                  <AnimatePresence>
                    {addresses.map((address, idx) => (
                      <motion.div
                        key={address.id}
                        className={`relative rounded-xl md:rounded-2xl shadow-sm border transition-all hover:shadow-md group ${
                          address.isDefault
                            ? 'bg-gradient-to-br from-gray-100 to-white border-gray-300'
                            : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {/* Default Badge */}
                        <AnimatePresence>
                          {address.isDefault && (
                            <motion.div
                              className="absolute top-2 right-2 md:top-4 md:right-4 inline-flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-gray-300 text-gray-800 rounded-full text-xs font-bold"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <Check size={12} className="md:w-3.5 md:h-3.5 stroke-[3]" />
                              <span className="hidden sm:inline">Mặc định</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Address Content */}
                        <div className="p-4 md:p-6">
                          {/* Address Header */}
                          <div className="mb-3 md:mb-4">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-1">
                              {address.street}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-1">
                              {address.state}, {address.city}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            {!address.isDefault && (
                              <Button
                                onClick={() => handleSetDefault(address.id)}
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                              >
                                Mặc định
                              </Button>
                            )}
                            <Button
                              onClick={() => openAddressModal(address)}
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                            >
                              Sửa
                            </Button>
                            <Button
                              onClick={() => setDeleteConfirmId(address.id)}
                              variant="danger"
                              size="sm"
                              className="flex-1"
                            >
                              Xoá
                            </Button>
                          </div>
                        </div>

                        {/* Delete Confirmation Modal */}
                        <AnimatePresence>
                          {deleteConfirmId === address.id && (
                            <motion.div
                              className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-sm z-50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              <motion.div
                                className="bg-white rounded-xl p-6 text-center max-w-xs"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  Xác nhận xoá
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                  Bạn có chắc chắn muốn xoá địa chỉ này? Hành động này không thể hoàn tác.
                                </p>
                                <div className="flex gap-3">
                                  <Button
                                    onClick={() => setDeleteConfirmId(null)}
                                    variant="secondary"
                                    className="flex-1"
                                  >
                                    Huỷ
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteAddress(address.id)}
                                    disabled={addressSaving}
                                    variant="danger"
                                    className="flex-1"
                                  >
                                    {addressSaving ? 'Đang xoá...' : 'Xoá'}
                                  </Button>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Add/Edit Address Form Modal */}
              <Modal 
                isOpen={showAddressModal} 
                onClose={closeAddressModal}
                size="sm"
                closeButton={true}
                header={
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {editingAddressId ? 'Cập nhật thông tin địa chỉ' : 'Thêm một địa chỉ giao hàng'}
                    </p>
                  </div>
                }
                footer={
                  <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-3">
                    <Button
                      onClick={closeAddressModal}
                      variant="secondary"
                      className="flex-1"
                    >
                      Huỷ
                    </Button>
                    <Button
                      onClick={handleSaveAddress}
                      disabled={addressSaving}
                      className="flex-1"
                    >
                      {addressSaving ? 'Đang lưu...' : editingAddressId ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </Button>
                  </div>
                }
              >
                {/* Form Message */}
                <AnimatePresence>
                  {addressMessage && (
                    <motion.div
                      className={`-mx-6 -mt-4 mb-6 px-6 py-3 md:py-4 rounded-t-2xl border-l-4 flex items-start gap-3 ${
                        addressMessage.type === 'success'
                          ? 'bg-gray-100 border-l-gray-600 text-gray-800'
                          : 'bg-gray-50 border-l-gray-600 text-gray-800'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="mt-0.5 text-lg md:text-xl flex-shrink-0 leading-none">
                        {addressMessage.type === 'success' ? '✓' : '⚠'}
                      </div>
                      <p className="font-medium text-xs md:text-sm leading-relaxed">
                        {addressMessage.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <div className={`space-y-3 md:space-y-4 ${addressMessage ? 'mt-4' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Đường/Phố <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      placeholder="Ví dụ: 123 Trần Phú"
                      autoComplete="street-address"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      placeholder="Ví dụ: Hà Đông"
                      autoComplete="address-level2"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Thành phố/Tỉnh <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="Ví dụ: Hà Nội"
                      autoComplete="address-level1"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-1 md:pt-2"
                  >
                    <Checkbox
                      label="Đặt làm địa chỉ mặc định"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isDefault: e.target.checked })
                      }
                      size="md"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 md:mt-2 ml-6">
                      Địa chỉ mặc định sẽ được dùng cho các đơn hàng tiếp theo
                    </p>
                  </motion.div>
                </div>
              </Modal>
            </motion.div>
          </motion.div>

          {/* Logout Section */}
          <motion.div
            className="mt-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm border border-gray-300 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <LogOut size={28} className="text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Đăng xuất</h2>
                <p className="text-sm text-gray-600 mt-1">Kết thúc phiên làm việc của bạn</p>
              </div>
            </div>

            <p className="text-gray-700 font-medium mb-6">
              Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng tài khoản của mình.
            </p>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                variant="danger"
                fullWidth
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
