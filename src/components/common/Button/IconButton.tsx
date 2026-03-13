import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Icon Button Component - Button with only an icon
 * @param variant - Button style variant (default: 'ghost')
 * @param size - Button size (default: 'md')
 * @param icon - Icon element or SVG
 * @param isLoading - Show loading state
 */
const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  icon,
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';

  const sizeStyles = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3',
  };

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-900 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
    danger: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed',
    outline: 'border-2 border-black text-black hover:bg-gray-100 focus:ring-gray-800 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed',
    ghost: 'text-black hover:bg-gray-100 focus:ring-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed',
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && 'opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      whileHover={!disabled ? { scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...(props as any)}
    >
      {isLoading ? (
        <motion.svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </motion.svg>
      ) : (
        icon
      )}
    </motion.button>
  );
};

export default IconButton;
