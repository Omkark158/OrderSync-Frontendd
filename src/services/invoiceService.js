// services/invoiceService.js - COMPLETE FIX
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

  // ✅ Download Invoice - Fixed binary handling
  downloadInvoice: async (invoiceId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get base URL from api instance or use default
      const baseURL = api.defaults.baseURL || 'http://localhost:5000/api';
      const url = `${baseURL}/invoices/${invoiceId}/download`;
      
      console.log('📥 Downloading from:', url);
      
      // Fetch with authorization
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `invoice_${invoiceId}.pdf`;
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      console.log('📄 Filename:', filename);
      
      // Get blob
      const blob = await response.blob();
      console.log('📦 Blob:', blob.type, blob.size, 'bytes');
      
      // Verify it's actually a PDF
      if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
        console.error('❌ Invalid content type:', blob.type);
        // Try to read as text to see error message
        const text = await blob.text();
        console.error('Response text:', text.substring(0, 500));
        throw new Error('Invalid PDF response');
      }
      
      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      console.log('✅ Download complete');
      return { success: true, filename };
      
    } catch (error) {
      console.error('❌ Download error:', error);
      throw error;
    }
  },

  // ✅ View Invoice in new tab
  viewInvoice: async (invoiceId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const baseURL = api.defaults.baseURL || 'http://localhost:5000/api';
      const url = `${baseURL}/invoices/${invoiceId}/view`;
      
      console.log('👁️ Opening invoice in new tab:', url);
      
      // Create form to POST with token (for better security)
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = url;
      form.target = '_blank';
      
      // Add hidden input with token
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token';
      input.value = token;
      form.appendChild(input);
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ View error:', error);
      throw error;
    }
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