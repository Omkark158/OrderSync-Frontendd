// ============================================
// 1. PaymentForm.jsx - Razorpay Payment Integration
// ============================================
import { useState, useEffect } from 'react';
import { CreditCard, Wallet, DollarSign, Loader } from 'lucide-react';

const PaymentForm = ({ orderId, amount, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState('full'); // full, advance
  const [advanceAmount, setAdvanceAmount] = useState(amount * 0.3); // 30% default

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createPaymentOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const paymentAmount = paymentType === 'full' ? amount : advanceAmount;

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          amount: paymentAmount,
          paymentType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment order creation error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (paymentType === 'advance' && advanceAmount < amount * 0.2) {
      alert('Advance payment must be at least 20% of total amount');
      return;
    }

    setLoading(true);

    try {
      // Create payment order
      const paymentData = await createPaymentOrder();

      // Configure Razorpay options
      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: 'Sachin Foods',
        description: `Order Payment - ${orderId}`,
        order_id: paymentData.razorpay_order_id,
        handler: async (response) => {
          // Payment successful
          await verifyPayment(response);
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}').name || '',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
          contact: JSON.parse(localStorage.getItem('user') || '{}').phone || '',
        },
        theme: {
          color: '#DC2626', // Red-600
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert('Payment cancelled');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      alert('Failed to initiate payment. Please try again.');
      if (onFailure) onFailure(error);
    }
  };

  const verifyPayment = async (response) => {
    try {
      const token = localStorage.getItem('token');
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const data = await verifyResponse.json();

      if (data.success) {
        if (onSuccess) onSuccess(data.data);
      } else {
        throw new Error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
      if (onFailure) onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-3 rounded-full">
          <CreditCard className="text-red-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
          <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
        </div>
      </div>

      {/* Payment Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Type
        </label>
        <div className="space-y-3">
          {/* Full Payment */}
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentType"
              value="full"
              checked={paymentType === 'full'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-4 h-4 text-red-600"
            />
            <DollarSign className="text-green-600" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Full Payment</p>
              <p className="text-sm text-gray-600">Pay entire amount now</p>
            </div>
            <p className="font-bold text-lg text-gray-900">₹{amount.toFixed(2)}</p>
          </label>

          {/* Advance Payment */}
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentType"
              value="advance"
              checked={paymentType === 'advance'}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-4 h-4 text-red-600"
            />
            <Wallet className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Advance Payment</p>
              <p className="text-sm text-gray-600">Pay partial amount (min 20%)</p>
            </div>
          </label>
        </div>
      </div>

      {/* Advance Amount Input */}
      {paymentType === 'advance' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Advance Amount (₹)
          </label>
          <input
            type="number"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(Number(e.target.value))}
            min={amount * 0.2}
            max={amount}
            step="0.01"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Min: ₹{(amount * 0.2).toFixed(2)} (20%)</span>
            <span>Max: ₹{amount.toFixed(2)} (100%)</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Balance: ₹{(amount - advanceAmount).toFixed(2)} (Pay on delivery)
          </p>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Total Order Amount</span>
          <span className="font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Paying Now</span>
          <span className="font-semibold text-green-600">
            ₹{(paymentType === 'full' ? amount : advanceAmount).toFixed(2)}
          </span>
        </div>
        {paymentType === 'advance' && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="text-gray-700">Balance (COD)</span>
            <span className="font-semibold text-orange-600">
              ₹{(amount - advanceAmount).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pay ₹{(paymentType === 'full' ? amount : advanceAmount).toFixed(2)}
          </>
        )}
      </button>

      {/* Security Info */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 justify-center">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secured by Razorpay • All transactions are encrypted</span>
      </div>

      {/* Accepted Payment Methods */}
      <div className="mt-6 pt-6 border-t">
        <p className="text-xs text-gray-600 text-center mb-3">Accepted Payment Methods</p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <div className="text-xs bg-gray-100 px-3 py-2 rounded">Credit Card</div>
          <div className="text-xs bg-gray-100 px-3 py-2 rounded">Debit Card</div>
          <div className="text-xs bg-gray-100 px-3 py-2 rounded">UPI</div>
          <div className="text-xs bg-gray-100 px-3 py-2 rounded">Net Banking</div>
          <div className="text-xs bg-gray-100 px-3 py-2 rounded">Wallets</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;