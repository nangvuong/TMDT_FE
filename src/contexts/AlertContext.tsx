import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import AlertModal from '../components/common/Alert/AlertModal';
import type { AlertType } from '../components/common/Alert/AlertModal';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  confirmText: string;
  cancelText: string;
  isLoading: boolean;
  showCancelButton: boolean;
  onlyConfirm: boolean;
  onConfirm?: () => void | Promise<void>;
}

interface AlertContextType {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  confirmText: string;
  cancelText: string;
  isLoading: boolean;
  showCancelButton: boolean;
  onlyConfirm: boolean;
  onConfirm?: () => void | Promise<void>;
  showAlert: (config: {
    title: string;
    message: string;
    type?: AlertType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    showCancelButton?: boolean;
    onlyConfirm?: boolean;
  }) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string, onConfirm?: () => void | Promise<void>, options?: { confirmText?: string; cancelText?: string }) => void;
  showInfo: (title: string, message: string) => void;
  closeAlert: () => void;
  setLoading: (loading: boolean) => void;
}

const AlertContext = React.createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    isLoading: false,
    showCancelButton: true,
    onlyConfirm: false,
  });

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(
    (config: {
      title: string;
      message: string;
      type?: AlertType;
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void | Promise<void>;
      showCancelButton?: boolean;
      onlyConfirm?: boolean;
    }) => {
      setAlertState({
        isOpen: true,
        title: config.title,
        message: config.message,
        type: config.type || 'info',
        confirmText: config.confirmText || 'Xác nhận',
        cancelText: config.cancelText || 'Hủy',
        isLoading: false,
        showCancelButton: config.showCancelButton !== false,
        onlyConfirm: config.onlyConfirm || false,
        onConfirm: config.onConfirm,
      });
    },
    []
  );

  const showSuccess = useCallback((title: string, message: string) => {
    showAlert({ title, message, type: 'success', onlyConfirm: true });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string) => {
    showAlert({ title, message, type: 'error', onlyConfirm: true });
  }, [showAlert]);

  const showWarning = useCallback(
    (title: string, message: string, onConfirm?: () => void | Promise<void>, options?: { confirmText?: string; cancelText?: string }) => {
      showAlert({
        title,
        message,
        type: 'warning',
        showCancelButton: true,
        onConfirm,
        confirmText: options?.confirmText || 'Xác nhận',
        cancelText: options?.cancelText || 'Hủy',
      });
    },
    [showAlert]
  );

  const showInfo = useCallback((title: string, message: string) => {
    showAlert({ title, message, type: 'info', onlyConfirm: true });
  }, [showAlert]);

  const setLoading = useCallback((loading: boolean) => {
    setAlertState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const value: AlertContextType = {
    isOpen: alertState.isOpen,
    title: alertState.title,
    message: alertState.message,
    type: alertState.type,
    confirmText: alertState.confirmText,
    cancelText: alertState.cancelText,
    isLoading: alertState.isLoading,
    showCancelButton: alertState.showCancelButton,
    onlyConfirm: alertState.onlyConfirm,
    onConfirm: alertState.onConfirm,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeAlert,
    setLoading,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        isLoading={alertState.isLoading}
        showCancelButton={alertState.showCancelButton}
        onlyConfirm={alertState.onlyConfirm}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};
