import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
}

/**
 * Checkbox Component - Animated checkbox with label and error states
 */
const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  size = 'md',
  helperText,
  disabled,
  className,
  checked,
  onChange,
  ...props
}) => {
  const sizeStyles = {
    sm: {
      box: 'w-4 h-4',
      icon: 16,
      label: 'text-sm',
    },
    md: {
      box: 'w-5 h-5',
      icon: 20,
      label: 'text-base',
    },
    lg: {
      box: 'w-6 h-6',
      icon: 24,
      label: 'text-lg',
    },
  };

  const sizes = sizeStyles[size];

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Checkbox Container */}
      <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
        {/* Custom Checkbox */}
        <motion.div
          className={cn(
            sizes.box,
            'relative flex items-center justify-center rounded-md border-2 transition-colors',
            checked
              ? 'bg-black border-black'
              : 'border-gray-300 bg-white hover:border-gray-400',
            error && 'border-gray-600',
            disabled && 'bg-gray-100 cursor-not-allowed'
          )}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {/* Hidden Input */}
          <input
            type="checkbox"
            className="absolute opacity-0 w-full h-full cursor-pointer"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            {...(props as any)}
          />

          {/* Check Mark */}
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Check size={sizes.icon} className="text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Label */}
        {label && (
          <span className={cn(sizes.label, 'text-gray-900 font-medium')}>
            {label}
          </span>
        )}
      </label>

      {/* Error Text */}
      {error && (
        <motion.span
          className="text-sm font-medium text-gray-600 ml-8"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.span>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <motion.span
          className="text-sm text-gray-600 ml-8"
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

export default Checkbox;
