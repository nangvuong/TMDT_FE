import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Mail, Lock, Home } from 'lucide-react';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import { useLogin } from '../../hooks/useAuth';
import fitnessImage from '../../assets/2.svg';
import { usePageTitle } from '../../hooks/usePageTitle';

/**
 * Login Page - User authentication with email and password
 */
const Login: React.FC = () => {
  // Update page title
  usePageTitle('Login | Fitness Mart');

  const navigate = useNavigate();
  const { login } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      // If login succeeds, redirect to home page
      navigate('/');
    } catch (err) {
      setError('Sai email hoặc mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Implement Google OAuth login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      {/* Home Button */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 p-3 bg-white hover:bg-gray-100 rounded-full shadow-md flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Quay lại trang chủ"
      >
        <Home size={20} className="text-gray-700" />
      </motion.button>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Section */}
        <div className="lg:hidden">
          {/* Mobile Form */}
          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Chào mừng quay trở lại
              </h1>
              <p className="text-base text-gray-600">
                đến <span className="font-bold">Fitness Mart</span>
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
              variants={containerVariants}
            >
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="ban@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startIcon={<Mail size={18} />}
                  variant="outline"
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <Input
                  type="password"
                  label="Mật khẩu"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startIcon={<Lock size={18} />}
                  variant="outline"
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <Checkbox
                  label="Ghi nhớ"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="md"
                  disabled={isLoading}
                />
                <motion.a
                  className="text-sm text-gray-600 hover:text-black font-medium no-underline"
                  whileHover={{ x: 5 }}
                >
                  Quên mật khẩu?
                </motion.a>
              </motion.div>

              {/* Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="relative flex items-center gap-4"
              >
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500 font-medium">Hoặc</span>
                <div className="flex-1 h-px bg-gray-300" />
              </motion.div>

              {/* Google Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Đăng nhập bằng Google
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center text-sm text-gray-600"
            >
              Chưa có tài khoản?{' '}
              <motion.a
                href="/register"
                className="font-bold text-black no-underline"
                whileHover={{ scale: 1.05 }}
              >
                Đăng ký tại đây
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Desktop Section */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div
            className="flex justify-center items-center"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={fitnessImage}
                alt="Fitness"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            className="w-full max-w-md mx-auto lg:mx-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Chào mừng quay trở lại
              </h1>
              <p className="text-lg text-gray-600">
                đến <span className="font-bold">Fitness Mart</span>
              </p>
            </motion.div>
            {/* Error Message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
              variants={containerVariants}
            >
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  label="Email"
                  placeholder="ban@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startIcon={<Mail size={18} />}
                  variant="outline"
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <Input
                  type="password"
                  label="Mật khẩu"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startIcon={<Lock size={18} />}
                  variant="outline"
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </motion.div>

              {/* Remember Me */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <Checkbox
                  label="Ghi nhớ"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="md"
                  disabled={isLoading}
                />
                <motion.a
                //   href="/forgot-password"
                  className="text-sm text-gray-600 hover:text-black font-medium no-underline"
                  whileHover={{ x: 5 }}
                >
                  Quên mật khẩu?
                </motion.a>
              </motion.div>

              {/* Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="relative flex items-center gap-4"
              >
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500 font-medium">Hoặc</span>
                <div className="flex-1 h-px bg-gray-300" />
              </motion.div>

              {/* Google Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Đăng nhập bằng Google
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              variants={itemVariants}
              className="mt-8 text-center text-sm text-gray-600"
            >
              Chưa có tài khoản?{' '}
              <motion.a
                href="/register"
                className="font-bold text-black no-underline"
                whileHover={{ scale: 1.05 }}
              >
                Đăng ký tại đây
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
