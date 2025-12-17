// ============================================
// 10. whatsappService.js - WhatsApp Integration
// ============================================
export const whatsappService = {
  // Share Invoice via WhatsApp
  shareInvoice: async (phone, invoiceUrl, orderNumber) => {
    try {
      // Format phone number (remove +91 if present)
      const formattedPhone = phone.replace(/\+91/, '').replace(/\s/g, '');
      
      // Create WhatsApp message
      const message = encodeURIComponent(
        `Hello! Your invoice for Order ${orderNumber} from Sachin Foods is ready.\n\nDownload: ${invoiceUrl}\n\nThank you for ordering with us!`
      );

      // Open WhatsApp Web/App
      const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      return { success: true };
    } catch (error) {
      console.error('WhatsApp share failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Share Order Confirmation
  shareOrderConfirmation: async (phone, orderNumber, totalAmount) => {
    try {
      const formattedPhone = phone.replace(/\+91/, '').replace(/\s/g, '');
      
      const message = encodeURIComponent(
        `Thank you for your order!\n\nOrder Number: ${orderNumber}\nTotal Amount: ₹${totalAmount}\n\nSachin Foods, Kundara\nContact: 9539387240`
      );

      const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      return { success: true };
    } catch (error) {
      console.error('WhatsApp share failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Share Payment Receipt
  sharePaymentReceipt: async (phone, orderNumber, paidAmount, balance) => {
    try {
      const formattedPhone = phone.replace(/\+91/, '').replace(/\s/g, '');
      
      const message = encodeURIComponent(
        `Payment Received!\n\nOrder: ${orderNumber}\nPaid: ₹${paidAmount}\nBalance: ₹${balance}\n\nThank you!\nSachin Foods, Kundara`
      );

      const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      return { success: true };
    } catch (error) {
      console.error('WhatsApp share failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send Custom Message
  sendMessage: async (phone, message) => {
    try {
      const formattedPhone = phone.replace(/\+91/, '').replace(/\s/g, '');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      return { success: true };
    } catch (error) {
      console.error('WhatsApp message failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Share Order Tracking Link
  shareTrackingLink: async (phone, orderNumber, trackingUrl) => {
    try {
      const formattedPhone = phone.replace(/\+91/, '').replace(/\s/g, '');
      
      const message = encodeURIComponent(
        `Track your order!\n\nOrder: ${orderNumber}\nTrack here: ${trackingUrl}\n\nSachin Foods`
      );

      const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      return { success: true };
    } catch (error) {
      console.error('WhatsApp share failed:', error);
      return { success: false, error: error.message };
    }
  },
};