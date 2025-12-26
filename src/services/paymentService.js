// services/paymentService.js - ENHANCED UPI INTEGRATION
import api from './api';
import toast from 'react-hot-toast';

export const paymentService = {
  createOrder: async (orderNumber, amount, paymentType = 'full') => {
    try {
      const response = await api.post('/payments/create-order', {
        orderNumber,
        amount,
        paymentType,
      });
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  handleFailure: async (errorData) => {
    try {
      const response = await api.post('/payments/failure', errorData);
      return response.data;
    } catch (error) {
      console.error('Handle failure error:', error);
      throw error;
    }
  },

  // ✅ ENHANCED UPI CHECKOUT
  openCheckout: async (orderId, amount, paymentType, onSuccess, onFailure) => {
    try {
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      console.log('📦 Fetching order details for:', orderId);
      const orderResponse = await api.get(`/orders/${orderId}`);
      
      if (!orderResponse.data.success) {
        throw new Error('Failed to fetch order details');
      }

      const order = orderResponse.data.data;
      const orderNumber = order.orderNumber;
      
      console.log('✅ Order number:', orderNumber);

      const orderData = await paymentService.createOrder(orderNumber, amount, paymentType);

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // ✅ RAZORPAY CONFIG WITH UPI PRIORITY
      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount * 100,
        currency: orderData.data.currency || 'INR',
        name: 'Sachin Foods',
        description: `${paymentType === 'full' ? 'Full Payment' : 'Advance Payment'} - Order ${orderNumber}`,
        image: '/logo.png',
        order_id: orderData.data.razorpay_order_id,
        
        // ✅ UPI-FIRST CONFIGURATION
        config: {
          display: {
            blocks: {
              // UPI Block - Priority #1
              upi: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr', 'collect', 'intent'] // QR, UPI ID, App Intent
                  }
                ]
              },
              // Cards Block
              cards: {
                name: 'Debit & Credit Cards',
                instruments: [
                  {
                    method: 'card',
                    types: ['credit', 'debit']
                  }
                ]
              },
              // Net Banking
              netbanking: {
                name: 'Net Banking',
                instruments: [
                  {
                    method: 'netbanking'
                  }
                ]
              },
              // Popular Wallets
              wallets: {
                name: 'Wallets',
                instruments: [
                  {
                    method: 'wallet',
                    wallets: ['paytm', 'phonepe', 'amazonpay', 'mobikwik', 'freecharge']
                  }
                ]
              }
            },
            // ✅ UPI DISPLAYED FIRST
            sequence: ['block.upi', 'block.cards', 'block.netbanking', 'block.wallets'],
            preferences: {
              show_default_blocks: true
            }
          }
        },

        // Payment success handler
        handler: async (response) => {
          try {
            console.log('✅ Payment completed, verifying...');
            
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber: orderNumber,
              amount: amount,
              paymentType: paymentType,
            });

            if (verifyData.success) {
              // ✅ Success callback shows the toast
              if (onSuccess) onSuccess(verifyData.data);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Verification error:', error);
            toast.error('Payment verification failed');
            if (onFailure) onFailure(error);
          }
        },

        // Pre-fill customer details
        prefill: {
          name: order.customerName || user.name || '',
          email: order.customerEmail || user.email || '',
          contact: order.customerPhone || user.phone || '',
        },

        // ✅ ALL PAYMENT METHODS ENABLED
        method: {
          upi: true,           // ✅ UPI (GPay, PhonePe, Paytm, etc.)
          card: true,          // Cards
          netbanking: true,    // Net Banking
          wallet: true,        // Wallets
          paylater: false,     // Pay Later (optional)
          emi: false,          // EMI (optional)
          cardless_emi: false  // Cardless EMI (optional)
        },

        // Additional metadata
        notes: {
          order_id: orderId,
          order_number: orderNumber,
          payment_type: paymentType,
          customer_name: order.customerName,
          customer_phone: order.customerPhone
        },

        // Theme customization
        theme: {
          color: '#DC2626',              // Primary red
          backdrop_color: '#1F2937',     // Dark background
          hide_topbar: false             // Show Razorpay branding
        },

        // Modal behavior
        modal: {
          backdropclose: false,          // Don't close on backdrop click
          escape: true,                  // Allow ESC key
          handleback: true,              // Handle Android back button
          confirm_close: true,           // Confirm before closing
          ondismiss: () => {
            console.log('⚠️ Payment cancelled by user');
            toast.error('Payment cancelled. You can retry anytime.');
            if (onFailure) onFailure({ message: 'Payment cancelled by user' });
          },
          animation: true                // Smooth animations
        },

        // ✅ RETRY CONFIGURATION
        retry: {
          enabled: true,
          max_count: 3                   // Allow 3 retry attempts
        },

        // Payment timeout (15 minutes)
        timeout: 900,

        // ✅ REMEMBER CUSTOMER PREFERENCE
        remember_customer: true,

        // ✅ READONLY CUSTOMER INFO (if already filled)
        readonly: {
          contact: !!order.customerPhone,
          email: !!order.customerEmail,
          name: !!order.customerName
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      
      // ✅ HANDLE PAYMENT FAILURE
      razorpay.on('payment.failed', async (response) => {
        console.error('❌ Payment failed:', response.error);
        
        // Log failure to backend
        try {
          await paymentService.handleFailure({
            razorpay_order_id: orderData.data.razorpay_order_id,
            orderNumber: orderNumber,
            error: response.error,
          });
        } catch (err) {
          console.error('Failed to log payment failure:', err);
        }

        // User-friendly error message
        let errorMsg = 'Payment failed. Please try again.';
        
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMsg = 'Invalid payment details. Please check and try again.';
        } else if (response.error.code === 'GATEWAY_ERROR') {
          errorMsg = 'Payment gateway error. Please try again.';
        } else if (response.error.description) {
          errorMsg = response.error.description;
        }

        toast.error(errorMsg);
        if (onFailure) onFailure(response.error);
      });

      // Open Razorpay modal
      console.log('🚀 Opening Razorpay checkout...');
      razorpay.open();
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast.error('Failed to open payment gateway. Please try again.');
      if (onFailure) onFailure(error);
    }
  },

  getPaymentHistory: async (orderNumber) => {
    try {
      const response = await api.get(`/payments/order/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  },
};

// Load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      console.log('✅ Razorpay already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay SDK loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      reject(new Error('Failed to load Razorpay SDK'));
    };
    
    document.body.appendChild(script);
  });
};

export default paymentService;