import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  className?: string;
}

/**
 * Skeleton Loader Component - Animated loading placeholder using Framer Motion
 * @param width - Width of the skeleton (default: '100%')
 * @param height - Height of the skeleton (default: '20px')
 * @param borderRadius - Border radius (default: '8px')
 * @param count - Number of skeleton lines to display (default: 1)
 * @param className - Additional CSS class
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  count = 1,
  className = '',
}) => {
  const shimmer = {
    initial: { backgroundPosition: '0% 0%' },
    animate: {
      backgroundPosition: ['200% 0%', '-200% 0%'],
    },
  };

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200',
            className
          )}
          style={{
            width: widthStyle,
            height: heightStyle,
            borderRadius: borderRadius,
            backgroundSize: '200% 100%',
          }}
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
