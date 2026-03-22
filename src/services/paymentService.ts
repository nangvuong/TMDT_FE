import axiosClient from './axiosClient';
import { PAYMENT_ENDPOINTS } from '../constants/api';

/**
 * Payment transaction
 */
export interface Transaction {
  id: string;
  transactionCode: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'cod';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  bankCode?: string;
  bankName?: string;
  accountNo?: string;
  accountName?: string;
  qrCodeUrl?: string;
  bankTransactionId?: string;
  paidAt?: Date;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create transaction payload
 */
export interface CreateTransactionPayload {
  orderId: string;
  paymentMethod?: 'bank_transfer' | 'cod';
}

/**
 * Check payment response
 */
export interface CheckPaymentResponse {
  status: string;
  message: string;
  transaction?: {
    id: string;
    transactionCode: string;
    amount: number;
    paidAt?: Date;
    bankTransactionId?: string;
  };
}

const paymentService = {
  // Create payment transaction (Authenticated 🔒)
  // Returns: { success: true, data: { transactionId, transactionCode, amount, qrCodeUrl, bankCode, bankName, accountNo, accountName, expiredAt, paymentInstructions } }
  createTransaction: (data: CreateTransactionPayload) =>
    axiosClient.post<any, any>(PAYMENT_ENDPOINTS.CREATE_TRANSACTION, data),

  // Check payment status by transaction code - POST (Authenticated 🔒)
  checkPaymentByCode: (transactionCode: string) =>
    axiosClient.post<any, CheckPaymentResponse>(PAYMENT_ENDPOINTS.CHECK_PAYMENT, {
      transactionCode,
    }),

  // Check payment status by transaction code - GET (Authenticated 🔒)
  checkPayment: (transactionCode: string) =>
    axiosClient.get<any, CheckPaymentResponse>(
      PAYMENT_ENDPOINTS.CHECK_PAYMENT_GET.replace(':transactionCode', transactionCode)
    ),

  // Get user's transactions (Authenticated 🔒)
  getTransactions: () =>
    axiosClient.get<any, Transaction[]>(PAYMENT_ENDPOINTS.GET_TRANSACTIONS),

  // Get transaction by ID (Authenticated 🔒)
  getTransaction: (id: string) =>
    axiosClient.get<any, Transaction>(
      PAYMENT_ENDPOINTS.GET_TRANSACTION.replace(':id', id)
    ),
};

export default paymentService;
