// ============================================
// 6. orderService.js - Order Management
// ============================================
import api from './api';

export const orderService = {
  // Create Order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get All Orders
  getAllOrders: async (status) => {
    const url = status ? `/orders?status=${status}` : '/orders';
    const response = await api.get(url);
    return response.data;
  },

  // Get Order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get Orders by Phone
  getOrdersByPhone: async (phone) => {
    const response = await api.get(`/orders/phone/${phone}`);
    return response.data;
  },

  // Update Order Status (Admin)
  updateOrderStatus: async (orderId, status, cancellationReason) => {
    const response = await api.put(`/orders/${orderId}/status`, {
      orderStatus: status,
      cancellationReason,
    });
    return response.data;
  },

  // Cancel Order
  cancelOrder: async (orderId, reason) => {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },
};