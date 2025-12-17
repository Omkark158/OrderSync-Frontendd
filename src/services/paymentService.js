// ============================================
// 7. paymentService.js - Payment Management
// ============================================
import api from './api';

export const paymentService = {
  // Create Payment Order
  createPaymentOrder: async (orderId, amount, paymentType) => {
    const response = await api.post('/payments/create-order', {
      orderId,
      amount,
      paymentType,
    });
    return response.data;
  },

  // Verify Payment
  verifyPayment: async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const response = await api.post('/payments/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return response.data;
  },

  // Handle Payment Failure
  handlePaymentFailure: async (razorpay_order_id, error) => {
    const response = await api.post('/payments/failure', {
      razorpay_order_id,
      error,
    });
    return response.data;
  },

  // Get Payment by Order ID
  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  // Get User Payments
  getUserPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
};