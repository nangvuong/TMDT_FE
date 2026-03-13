import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import Textarea from '../../components/common/Textarea/Textarea';
import Button from '../../components/common/Button/Button';
import ProfileSkeleton from '../../components/loading/ProfileSkeleton';
import { useProfile } from '../../hooks/useProfile';
import { useIsLoggedIn } from '../../hooks/useAuth';
import type { PhysicalProfile } from '../../types/user';

/**
 * Profile Content - User physical profile management (no Layout wrapper)
 */
const Profile: React.FC<{ onBackClick?: () => void }> = ({ onBackClick }) => {
  const { isLoggedIn } = useIsLoggedIn();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();

  // Form state
  const [formData, setFormData] = useState<Partial<PhysicalProfile>>({
    heightCm: 0,
    weightKg: 0,
    age: 0,
    fitnessGoal: 'muscle_gain',
    dietaryPreferences: '',
    allergies: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Redirect to login if logged out (e.g., due to expired token)
  useEffect(() => {
    if (!isLoggedIn) {
      onBackClick?.();
    }
  }, [isLoggedIn, onBackClick]);

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile();
      } catch (err) {
        // Error is already handled by useProfile hook
        // 404 means no profile created yet - that's OK, user can create one
        // If it's a 401, axiosClient interceptor will handle token removal
      }
    };
    loadProfile();
  }, [fetchProfile]);

  // Populate form with current profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        heightCm: profile.heightCm ? parseFloat(String(profile.heightCm)) : 0,
        weightKg: profile.weightKg ? parseFloat(String(profile.weightKg)) : 0,
        age: profile.age || 0,
        fitnessGoal: profile.fitnessGoal || 'muscle_gain',
        dietaryPreferences: profile.dietaryPreferences || '',
        allergies: profile.allergies || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'heightCm' || name === 'weightKg' 
        ? parseFloat(value) || 0
        : name === 'age'
          ? parseInt(value) || 0
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.heightCm || !formData.weightKg || !formData.age) {
        setSubmitError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setIsSubmitting(false);
        return;
      }

      await updateProfile(formData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <motion.button
        onClick={() => onBackClick?.()}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 text-sm font-medium"
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowLeft size={18} />
        Quay lại
      </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-black mb-2">Hồ sơ thể chất</h1>
          <p className="text-gray-600">Cập nhật thông tin thể chất của bạn để nhận được những gợi ý phù hợp</p>
        </motion.div>

        {/* Loading State */}
        {loading && <ProfileSkeleton />}

        {/* Error State - only show if it's not a 404 (no profile yet) */}
        {error && !loading && !error.includes('404') && (
          <motion.div
            className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Form Content */}
        {!loading && (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-gray-200 rounded-lg p-8 space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Profile Status Message */}
            {(!profile || error?.includes('404')) && (
              <motion.div
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3"
                variants={itemVariants}
              >
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-600 text-sm font-medium">
                  Bạn chưa cập nhật hồ sơ thể chất. Vui lòng điền thông tin bên dưới để tạo hồ sơ mới.
                </p>
              </motion.div>
            )}

            {/* Submit Success Message */}
            {submitSuccess && (
              <motion.div
                className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-600 text-sm font-medium">
                  Cập nhật hồ sơ thành công
                </p>
              </motion.div>
            )}

            {/* Submit Error Message */}
            {submitError && (
              <motion.div
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm font-medium">{submitError}</p>
              </motion.div>
            )}

            {/* Physical Information Section */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-black">Thông tin thể chất</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Height */}
                <Input
                  type="number"
                  name="heightCm"
                  label="Chiều cao (cm)"
                  placeholder="175"
                  value={formData.heightCm || ''}
                  onChange={handleInputChange}
                  inputSize="md"
                  required
                />

                {/* Weight */}
                <Input
                  type="number"
                  name="weightKg"
                  label="Cân nặng (kg)"
                  placeholder="70"
                  value={formData.weightKg || ''}
                  onChange={handleInputChange}
                  inputSize="md"
                  required
                />

                {/* Age */}
                <Input
                  type="number"
                  name="age"
                  label="Tuổi"
                  placeholder="25"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  inputSize="md"
                  required
                />
              </div>
            </motion.div>

            {/* Fitness Goal Section */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-black">Mục tiêu</h2>
              <Select
                name="fitnessGoal"
                value={formData.fitnessGoal || 'muscle_gain'}
                onChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value as string }))}
                options={[
                  { value: 'weight_loss', label: 'Giảm cân' },
                  { value: 'muscle_gain', label: 'Tăng cơ' },
                  { value: 'strength', label: 'Sức mạnh' },
                  { value: 'endurance', label: 'Thể lực' },
                  { value: 'general_fitness', label: 'Sức khỏe chung' },
                ]}
                placeholder="Chọn mục tiêu"
                fullWidth
              />
            </motion.div>

            {/* Dietary Preferences Section */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h2 className="text-xl font-semibold text-black">Sở thích ăn uống</h2>
              
              <Textarea
                name="dietaryPreferences"
                label="Sở thích dinh dưỡng"
                placeholder="VD: Ăn nhiều protein, ít carb..."
                value={formData.dietaryPreferences || ''}
                onChange={handleInputChange}
                inputSize="md"
              />

              {/* Allergies */}
              <Textarea
                name="allergies"
                label="Dị ứng thực phẩm (nếu có)"
                placeholder="VD: Dị ứng sữa, các loại hạt..."
                value={formData.allergies || ''}
                onChange={handleInputChange}
                inputSize="md"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex gap-4 pt-6" variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Lưu hồ sơ'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => onBackClick?.()}
              >
                Hủy
              </Button>
            </motion.div>
          </motion.form>
        )}
      </div>
    );
};

export default Profile;
