import React from 'react';
import SkeletonLoader from './SkeletonLoader';

/**
 * Skeleton Loader for User Profile Page
 */
const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex-shrink-0">
          <SkeletonLoader height={120} width={120} borderRadius="50%" />
        </div>
        <div className="flex-1 space-y-3">
          <SkeletonLoader height={24} width={150} borderRadius="4px" />
          <SkeletonLoader height={14} width={200} borderRadius="4px" />
        </div>
      </div>

      {/* Edit Button */}
      <div>
        <SkeletonLoader height={40} width={120} borderRadius="6px" />
      </div>

      {/* Profile Form Sections */}
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
          <SkeletonLoader height={20} width={200} borderRadius="4px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`field-${index}`} className="space-y-2">
                <SkeletonLoader height={14} width={80} borderRadius="4px" />
                <SkeletonLoader height={36} borderRadius="6px" />
              </div>
            ))}
          </div>
        </div>

        {/* Physical Profile Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
          <SkeletonLoader height={20} width={200} borderRadius="4px" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`physical-${index}`} className="space-y-2">
                <SkeletonLoader height={14} width={80} borderRadius="4px" />
                <SkeletonLoader height={36} borderRadius="6px" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <SkeletonLoader height={40} width={120} borderRadius="6px" />
          <SkeletonLoader height={40} width={120} borderRadius="6px" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
