import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input Component - Text input with label, error, and animations
 * @param label - Label text for the input
 * @param error - Error message to display
 * @param size - Input size (default: 'md')
 * @param variant - Input style variant (default: 'default')
 * @param helperText - Helper text below input
 * @param startIcon - Icon at start of input
 * @param endIcon - Icon at end of input
 * @param fullWidth - Make input full width
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  inputSize = 'md',
  variant = 'default',
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const baseInputStyles = 'w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variantStyles = {
    default: 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-black hover:border-gray-400',
    outline: 'bg-transparent border-2 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-black focus:ring-black',
    filled: 'bg-gray-100 border-b-2 border-gray-400 text-gray-900 placeholder:text-gray-600 focus:bg-gray-50 focus:border-black focus:ring-0',
  };

  const labelStyles = 'block text-sm font-medium text-gray-900 mb-2';
  const errorStyles = 'text-sm font-medium text-gray-600 mt-1';
  const helperStyles = 'text-sm text-gray-600 mt-1';

  return (
    <motion.div
      className={cn('flex flex-col', fullWidth && 'w-full')}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className={labelStyles}>
          {label}
          {props.required && <span className="text-gray-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {startIcon && (
          <span className="absolute left-3 text-gray-500 flex items-center pointer-events-none h-full flex items-center">
            {startIcon}
          </span>
        )}

        <motion.input
          className={cn(
            baseInputStyles,
            sizeStyles[inputSize],
            variantStyles[variant],
            error && 'border-gray-600 focus:border-gray-600 focus:ring-gray-600',
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-10' : '',
            className
          )}
          disabled={disabled}
          whileFocus={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...(props as any)}
        />

        {endIcon && (
          <span className="absolute right-3 text-gray-500 flex items-center pointer-events-none h-full flex items-center">
            {endIcon}
          </span>
        )}
      </div>

      {error && (
        <motion.span
          className={errorStyles}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.span>
      )}

      {helperText && !error && (
        <motion.span
          className={helperStyles}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {helperText}
        </motion.span>
      )}
    </motion.div>
  );
};

export default Input;
