import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

/**
 * Slider Component - Range input with animated thumb and track
 */
const Slider: React.FC<SliderProps> = ({
  label,
  error,
  size = 'md',
  helperText,
  showValue = true,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled,
  unit,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((Number(value) - min) / (max - min)) * 100;

  const sizeStyles = {
    sm: {
      track: 'h-1',
      thumb: 'w-4 h-4',
    },
    md: {
      track: 'h-2',
      thumb: 'w-5 h-5',
    },
    lg: {
      track: 'h-3',
      thumb: 'w-6 h-6',
    },
  };

  const sizes = sizeStyles[size];

  const labelStyles = 'block text-sm font-medium text-gray-900 mb-3 flex items-center justify-between';
  const errorStyles = 'text-sm font-medium text-gray-600 mt-2';
  const helperStyles = 'text-sm text-gray-600 mt-2';

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Label */}
      {label && (
        <div className={labelStyles}>
          <span>{label}</span>
          {showValue && (
            <motion.span
              key={value}
              className="font-bold text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
              {unit && ` ${unit}`}
            </motion.span>
          )}
        </div>
      )}

      {/* Slider Container */}
      <div className={cn('relative', disabled && 'opacity-50 cursor-not-allowed')}>
        {/* Track Background */}
        <div className={cn('absolute inset-y-0 w-full bg-gray-200 rounded-full', sizes.track)} />

        {/* Track Fill */}
        <motion.div
          className={cn('absolute inset-y-0 bg-black rounded-full', sizes.track)}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Input Range */}
        <input
          ref={inputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
          {...(props as any)}
        />

        {/* Custom Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 transform -translate-y-1/2 bg-white border-2 border-black rounded-full shadow-lg cursor-pointer',
            sizes.thumb,
            disabled && 'cursor-not-allowed'
          )}
          style={{
            left: `calc(${percentage}% - ${size === 'sm' ? 8 : size === 'md' ? 10 : 12}px)`,
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging
              ? '0 0 0 8px rgba(0, 0, 0, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        />
      </div>

      {/* Error Text */}
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

      {/* Helper Text */}
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

export default Slider;
