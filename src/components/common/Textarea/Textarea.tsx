import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Textarea Component - Multi-line text input with label, error, and animations
 */
const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  inputSize = 'md',
  variant = 'default',
  helperText,
  fullWidth = false,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-500 resize-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[100px]',
    md: 'px-4 py-2 text-base min-h-[120px]',
    lg: 'px-5 py-3 text-lg min-h-[140px]',
  };

  const variantStyles = {
    default: 'bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white hover:border-gray-400 dark:hover:border-gray-500',
    outline: 'bg-transparent border-2 border-gray-800 dark:border-gray-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white',
    filled: 'bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:bg-gray-50 dark:focus:bg-gray-800 focus:border-black dark:focus:border-white focus:ring-0',
  };

  const labelStyles = 'block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2';
  const errorStyles = 'text-sm font-medium text-gray-600 dark:text-gray-400 mt-1';
  const helperStyles = 'text-sm text-gray-600 dark:text-gray-400 mt-1';

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
          {props.required && <span className="text-gray-600 dark:text-gray-400 ml-1">*</span>}
        </label>
      )}

      <motion.textarea
        className={cn(
          baseStyles,
          sizeStyles[inputSize],
          variantStyles[variant],
          error && 'border-gray-600 focus:border-gray-600 focus:ring-gray-600',
          className
        )}
        disabled={disabled}
        whileFocus={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...(props as any)}
      />

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

export default Textarea;
