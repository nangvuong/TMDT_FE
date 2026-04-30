import React from 'react';
import { motion } from 'framer-motion';
import cn from '../../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Button Component using Tailwind CSS with Framer Motion animations
 * @param variant - Button style variant (default: 'primary')
 * @param size - Button size (default: 'md')
 * @param isLoading - Show loading state
 * @param fullWidth - Make button full width
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  // Base styles
  const baseStyles = 'font-medium inline-flex items-center justify-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

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
    primary: 'bg-black text-white hover:bg-gray-900 focus:ring-gray-800 dark:focus:ring-gray-400 active:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 focus:ring-gray-300 dark:focus:ring-gray-500 active:bg-gray-500 dark:active:bg-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-500',
    danger: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 active:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed',
    success: 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-700 active:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed',
    warning: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-600 active:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed',
    outline: 'border-2 border-gray-400 dark:border-gray-500 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400 active:bg-gray-200 dark:active:bg-gray-600 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed',
    ghost: 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400 active:bg-gray-300 dark:active:bg-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed',
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      whileHover={!disabled ? { scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...(props as any)}
    >
      {isLoading && (
        <motion.svg
          className="animate-spin -ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </motion.svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
