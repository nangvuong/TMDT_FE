import React from 'react';
import { motion } from 'framer-motion';
import SkeletonLoader from './SkeletonLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
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

/**
 * Skeleton Loader for User Profile Page
 */
const ProfileSkeleton: React.FC = () => {
  return (
    <motion.div
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-xl shadow-sm p-6 md:p-8"
        variants={itemVariants}
      >
        <div className="flex-shrink-0">
          <SkeletonLoader height={120} width={120} borderRadius="50%" />
        </div>
        <div className="flex-1 w-full space-y-3">
          <SkeletonLoader height={24} width={150} borderRadius="6px" />
          <SkeletonLoader height={14} width={200} borderRadius="4px" />
        </div>
      </motion.div>

      {/* Edit Button */}
      <motion.div variants={itemVariants}>
        <SkeletonLoader height={44} width={130} borderRadius="8px" />
      </motion.div>

      {/* Profile Form Sections */}
      <div className="space-y-6">
        {/* Personal Information Section */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4"
          variants={itemVariants}
        >
          <SkeletonLoader height={20} width={200} borderRadius="6px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div key={`field-${index}`} className="space-y-3" variants={itemVariants}>
                <SkeletonLoader height={14} width={80} borderRadius="4px" />
                <SkeletonLoader height={40} borderRadius="8px" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Physical Profile Section */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-4"
          variants={itemVariants}
        >
          <SkeletonLoader height={20} width={200} borderRadius="6px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div key={`physical-${index}`} className="space-y-3" variants={itemVariants}>
                <SkeletonLoader height={14} width={80} borderRadius="4px" />
                <SkeletonLoader height={40} borderRadius="8px" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="flex gap-4" variants={itemVariants}>
          <SkeletonLoader height={44} width={130} borderRadius="8px" />
          <SkeletonLoader height={44} width={130} borderRadius="8px" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSkeleton;
