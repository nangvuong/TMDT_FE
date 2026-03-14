import React from 'react';
import { motion } from 'framer-motion';
import cn from '../../utils/cn';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  count?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Skeleton Loader Component - Animated loading placeholder using Framer Motion
 * @param width - Width of the skeleton (default: '100%')
 * @param height - Height of the skeleton (default: '20px')
 * @param borderRadius - Border radius (default: '8px')
 * @param count - Number of skeleton lines to display (default: 1)
 * @param className - Additional CSS class
 * @param animate - Enable shimmer animation (default: true)
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  count = 1,
  className = '',
  animate = true,
}) => {
  const shimmer = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate={animate ? 'visible' : 'hidden'}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'bg-gradient-to-r from-gray-200 via-white to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
            className
          )}
          style={{
            width: widthStyle,
            height: heightStyle,
            borderRadius: borderRadius,
          }}
          variants={shimmer}
          initial="initial"
          animate={animate ? 'animate' : 'initial'}
        />
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;
