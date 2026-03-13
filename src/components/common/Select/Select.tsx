import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  helperText?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  onChange?: (value: string | number) => void;
}

/**
 * Select Component - Dropdown with search, animations and custom styling
 */
const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Select an option',
  inputSize = 'md',
  variant = 'default',
  helperText,
  fullWidth = false,
  disabled,
  searchable = false,
  clearable = false,
  value,
  onChange,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const selectedOption = options.find((opt) => opt.value === value);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  useEffect(() => {
    if (searchable && searchTerm) {
      setFilteredOptions(
        options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const variantStyles = {
    default: 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400',
    outline: 'bg-transparent border-2 border-gray-800 text-gray-900',
    filled: 'bg-gray-100 border-b-2 border-gray-400 text-gray-900',
  };

  const baseStyles =
    'w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:border-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-between';

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

      <div ref={containerRef} className="relative w-full">
        {/* Select Button */}
        <motion.button
          type="button"
          className={cn(
            baseStyles,
            sizeStyles[inputSize],
            variantStyles[variant],
            error && 'border-gray-600 focus:border-gray-600 focus:ring-gray-600',
            disabled && 'opacity-50',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          whileHover={!disabled ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span className="flex-1 text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      className={cn(
                        'w-full text-left px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                        selectedOption?.value === option.value
                          ? 'bg-black text-white font-medium'
                          : 'hover:bg-gray-100 text-gray-900'
                      )}
                      onClick={() => {
                        if (!option.disabled) {
                          onChange?.(option.value);
                          setIsOpen(false);
                          setSearchTerm('');
                        }
                      }}
                      disabled={option.disabled}
                      whileHover={!option.disabled ? { paddingLeft: 24 } : {}}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {option.label}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No options found
                  </div>
                )}
              </div>

              {/* Clear Button */}
              {clearable && selectedOption && (
                <div className="border-t border-gray-200 p-2">
                  <button
                    className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      onChange?.('');
                      setIsOpen(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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

export default Select;
