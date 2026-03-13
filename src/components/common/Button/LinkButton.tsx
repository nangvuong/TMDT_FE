import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Link Button Component - Styled link that looks like a button
 * @param variant - Button style variant (default: 'primary')
 * @param size - Button size (default: 'md')
 * @param fullWidth - Make button full width
 */
const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  // Base styles
  const baseStyles = 'font-medium font-sans inline-flex items-center justify-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 text-decoration-none cursor-pointer';

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg',
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-900 focus:ring-gray-800 active:bg-gray-800',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-700 active:bg-gray-900',
    danger: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600 active:bg-gray-800',
    outline: 'border-2 border-black text-black hover:bg-gray-100 focus:ring-gray-800 active:bg-gray-200',
    ghost: 'text-black hover:bg-gray-100 focus:ring-gray-800 active:bg-gray-200',
  };

  return (
    <motion.a
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full justify-center',
        className
      )}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...(props as any)}
    >
      {children}
    </motion.a>
  );
};

export default LinkButton;
