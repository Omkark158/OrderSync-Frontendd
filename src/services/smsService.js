// ============================================
// 8. smsService.js - SMS/OTP Service
// ============================================
import api from './api';

export const smsService = {
  // Send OTP via SMS
  sendOTP: async (phone, otp, purpose) => {
    try {
      // This would typically call your backend SMS service
      console.log(`Sending OTP ${otp} to ${phone} for ${purpose}`);
      
      // For development, just log
      if (import.meta.env.DEV) {
        console.log('📱 SMS Service (Dev Mode):', { phone, otp, purpose });
        return { success: true, message: 'OTP logged to console' };
      }

      // In production, this would make actual API call
      const response = await api.post('/sms/send-otp', { phone, otp, purpose });
      return response.data;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  },

  // Send Order Confirmation SMS
  sendOrderConfirmation: async (phone, orderNumber, orderDateTime) => {
    try {
      const response = await api.post('/sms/order-confirmation', {
        phone,
        orderNumber,
        orderDateTime,
      });
      return response.data;
    } catch (error) {
      console.error('Order confirmation SMS failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send Order Status Update SMS
  sendOrderStatusUpdate: async (phone, orderNumber, status) => {
    try {
      const response = await api.post('/sms/order-status', {
        phone,
        orderNumber,
        status,
      });
      return response.data;
    } catch (error) {
      console.error('Status update SMS failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send Event Reminder SMS
  sendEventReminder: async (phone, eventDateTime, guestCount) => {
    try {
      const response = await api.post('/sms/event-reminder', {
        phone,
        eventDateTime,
        guestCount,
      });
      return response.data;
    } catch (error) {
      console.error('Reminder SMS failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send Payment Confirmation SMS
  sendPaymentConfirmation: async (phone, amount, orderId) => {
    try {
      const response = await api.post('/sms/payment-confirmation', {
        phone,
        amount,
        orderId,
      });
      return response.data;
    } catch (error) {
      console.error('Payment confirmation SMS failed:', error);
      return { success: false, error: error.message };
    }
  },
};