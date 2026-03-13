import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Modal Component - Animated modal dialog with Framer Motion
 * @param isOpen - Control modal visibility
 * @param title - Modal header title
 * @param onClose - Callback when modal should close
 * @param children - Modal body content
 * @param size - Modal width size (default: 'md')
 * @param closeButton - Show close button (default: true)
 * @param closeOnBackdropClick - Close on backdrop click (default: true)
 * @param closeOnEscape - Close on Escape key (default: true)
 * @param header - Custom header node (overrides title)
 * @param footer - Footer content section
 * @param className - Additional classes for modal content
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  size = 'md',
  closeButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  header,
  footer,
  className,
}) => {
  // Handle Escape key
  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  } as any;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  } as any;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            className={cn(
              'relative w-full bg-white rounded-lg shadow-2xl',
              sizeStyles[size],
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || header || closeButton) && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div className="flex-1">
                  {header ? (
                    header
                  ) : title ? (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  ) : null}
                </div>

                {closeButton && (
                  <motion.button
                    onClick={onClose}
                    className="ml-4 p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
