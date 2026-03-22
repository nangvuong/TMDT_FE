import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  isLoading?: boolean;
  showCancelButton?: boolean;
  onlyConfirm?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  isLoading = false,
  showCancelButton = true,
  onlyConfirm = false,
}) => {
  const getConfig = () => {
    const configs = {
      success: {
        iconColor: 'text-gray-700',
        icon: CheckCircle2,
      },
      error: {
        iconColor: 'text-gray-700',
        icon: AlertCircle,
      },
      warning: {
        iconColor: 'text-gray-700',
        icon: AlertTriangle,
      },
      info: {
        iconColor: 'text-gray-700',
        icon: Info,
      },
    };
    return configs[type];
  };

  const config = getConfig();
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeButton={false}
      header={
        <div className="flex items-start gap-3">
          <motion.div
            className="flex-shrink-0 mt-0.5"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">{title}</h3>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          {showCancelButton && !onlyConfirm && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-700 text-base leading-relaxed">{message}</p>
    </Modal>
  );
};

export default AlertModal;
