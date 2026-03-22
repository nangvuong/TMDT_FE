import { useState, useCallback } from 'react';
import paymentService, {
  type Transaction,
  type CreateTransactionPayload,
  type CheckPaymentResponse,
} from '../services/paymentService';

export const usePayment = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new payment transaction for an order
   */
  const createTransaction = useCallback(async (payload: CreateTransactionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.createTransaction(payload);
      // Response structure: { success: true, data: { transactionId, transactionCode, amount, qrCodeUrl, ... } }
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check payment status by transaction code
   */
  const checkPayment = useCallback(async (transactionCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.checkPayment(transactionCode);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check payment status by transaction code (POST method)
   */
  const checkPaymentByCode = useCallback(async (transactionCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.checkPaymentByCode(transactionCode);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's payment transactions
   */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getTransactions();
      setTransactions(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a specific transaction by ID
   */
  const getTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const transaction = await paymentService.getTransaction(id);
      setCurrentTransaction(transaction);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    transactions,
    currentTransaction,
    loading,
    error,

    // Payment actions
    createTransaction,
    checkPayment,
    checkPaymentByCode,
    fetchTransactions,
    getTransaction,

    // Utilities
    clearError,
  };
};
