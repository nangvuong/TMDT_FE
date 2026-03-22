import { useState, useCallback } from 'react';
import type { AlertType } from '../components/common/Alert';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void | Promise<void>;
  isLoading: boolean;
  showCancelButton: boolean;
  onlyConfirm: boolean;
}

const initialState: AlertState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy',
  isLoading: false,
  showCancelButton: true,
  onlyConfirm: false,
};

export const useAlert = () => {
  const [state, setState] = useState<AlertState>(initialState);

  const closeAlert = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const showAlert = useCallback(
    (options: {
      title: string;
      message: string;
      type?: AlertType;
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void | Promise<void>;
      showCancelButton?: boolean;
      onlyConfirm?: boolean;
    }) => {
      setState((prev) => ({
        ...prev,
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        onConfirm: options.onConfirm,
        showCancelButton: options.showCancelButton !== false,
        onlyConfirm: options.onlyConfirm || false,
        isLoading: false,
      }));
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void | Promise<void>) => {
      showAlert({ title, message, type: 'success', onConfirm, onlyConfirm: true });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, onConfirm?: () => void | Promise<void>) => {
      showAlert({ title, message, type: 'error', onConfirm, onlyConfirm: true });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (
      title: string,
      message: string,
      onConfirm?: () => void | Promise<void>,
      options?: { confirmText?: string; cancelText?: string }
    ) => {
      showAlert({
        title,
        message,
        type: 'warning',
        onConfirm,
        showCancelButton: true,
        confirmText: options?.confirmText || 'Xác nhận',
        cancelText: options?.cancelText || 'Hủy',
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, onConfirm?: () => void | Promise<void>) => {
      showAlert({ title, message, type: 'info', onConfirm, onlyConfirm: true });
    },
    [showAlert]
  );

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  return {
    ...state,
    closeAlert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    setLoading,
  };
};
