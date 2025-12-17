// ============================================
// 4. invoiceService.js - Invoice Management
// ============================================
import api from './api';

export const invoiceService = {
  // Generate Invoice (Admin)
  generateInvoice: async (orderId, invoiceData) => {
    const response = await api.post(`/invoices/generate/${orderId}`, invoiceData);
    return response.data;
  },

  // Get All Invoices
  getAllInvoices: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/invoices?${params}` : '/invoices';
    const response = await api.get(url);
    return response.data;
  },

  // Get Invoice by ID
  getInvoiceById: async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  // Get Invoice by Order ID
  getInvoiceByOrderId: async (orderId) => {
    const response = await api.get(`/invoices/order/${orderId}`);
    return response.data;
  },

  // Download Invoice PDF
  downloadInvoice: async (invoiceId) => {
    const token = localStorage.getItem('token');
    const url = `${api.defaults.baseURL}/invoices/${invoiceId}/download`;
    window.open(url, '_blank');
  },

  // Update Payment Status (Admin)
  updatePaymentStatus: async (invoiceId, receivedAmount) => {
    const response = await api.put(`/invoices/${invoiceId}/payment`, { receivedAmount });
    return response.data;
  },

  // Cancel Invoice (Admin)
  cancelInvoice: async (invoiceId) => {
    const response = await api.put(`/invoices/${invoiceId}/cancel`);
    return response.data;
  },
};