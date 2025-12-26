// src/components/admin/PaymentModal.jsx
import { useState } from 'react';
import { X, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [paymentType, setPaymentType] = useState('remaining'); // 'full', 'advance', 'remaining'
  const [customAmount, setCustomAmount] = useState(order.remainingAmount);
  const [loading, setLoading] = useState(false);

  const totalAmount = order.totalAmount;
  const paidAmount = order.advancePayment || 0;
  const remainingAmount = order.remainingAmount || 0;

  // Calculate limits
  const minAdvance = 1;
  const maxAdvance = remainingAmount - 1;

  // Handle payment type change
  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    if (type === 'remaining') {
      setCustomAmount(remainingAmount);
    } else if (type === 'full') {
      setCustomAmount(totalAmount);
    } else if (type === 'advance') {
      setCustomAmount(Math.ceil(remainingAmount / 2));
    }
  };

  // Handle payment
  const handlePayment = async () => {
    // Validation
    if (paymentType === 'advance') {
      if (customAmount < minAdvance || customAmount >= remainingAmount) {
        toast.error(`Advance must be between ₹${minAdvance} and ₹${remainingAmount - 1}`);
        return;
      }
    }

    if (customAmount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    setLoading(true);

    try {
      // Open Razorpay checkout
      await paymentService.openCheckout(
        order._id,        // MongoDB order ID
        customAmount,     // Amount to collect
        paymentType,      // 'full', 'advance', or 'remaining'
        (paymentData) => {
          // ✅ Success callback
          toast.success('Payment collected successfully! 🎉');
          onSuccess(paymentData); // Notify parent component
          setLoading(false);
        },
        (error) => {
          // ❌ Failure callback
          console.error('Payment error:', error);
          toast.error(error?.error?.description || 'Payment failed');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Payment modal error:', error);
      toast.error(error.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Collect Payment</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
          <p className="text-sm text-gray-600 mt-2">{order.customerName}</p>
          <p className="text-sm text-gray-500">{order.customerPhone}</p>
        </div>

        {/* Payment Summary */}
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Total Amount</span>
            <span className="font-bold text-gray-900">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Already Paid</span>
            <span className="font-semibold text-green-600">₹{paidAmount}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold text-gray-900">Balance Due</span>
            <span className="font-bold text-red-600">₹{remainingAmount}</span>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="space-y-3 mb-6">
          {/* Remaining Payment (if partial paid) */}
          {paidAmount > 0 && (
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentType === 'remaining'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="remaining"
                checked={paymentType === 'remaining'}
                onChange={() => handlePaymentTypeChange('remaining')}
                className="mt-1 w-4 h-4 text-green-600"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="text-green-600" size={20} />
                  <span className="font-semibold">Pay Balance</span>
                </div>
                <p className="text-sm text-gray-600">Complete the remaining payment</p>
                <p className="text-xl font-bold text-green-600 mt-2">₹{remainingAmount}</p>
              </div>
            </label>
          )}

          {/* Full Payment (if nothing paid) */}
          {paidAmount === 0 && (
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentType === 'full'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === 'full'}
                onChange={() => handlePaymentTypeChange('full')}
                className="mt-1 w-4 h-4 text-blue-600"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="text-blue-600" size={20} />
                  <span className="font-semibold">Full Payment</span>
                </div>
                <p className="text-sm text-gray-600">Pay complete amount now</p>
                <p className="text-xl font-bold text-blue-600 mt-2">₹{totalAmount}</p>
              </div>
            </label>
          )}

          {/* Advance/Partial Payment */}
          {remainingAmount > 1 && (
            <label
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentType === 'advance'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="advance"
                checked={paymentType === 'advance'}
                onChange={() => handlePaymentTypeChange('advance')}
                className="mt-1 w-4 h-4 text-purple-600"
                disabled={loading}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="text-purple-600" size={20} />
                  <span className="font-semibold">Partial Payment</span>
                </div>
                <p className="text-sm text-gray-600">Pay custom amount now</p>
              </div>
            </label>
          )}
        </div>

        {/* Custom Amount Input (for advance) */}
        {paymentType === 'advance' && (
          <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                min={minAdvance}
                max={maxAdvance}
                step="1"
                disabled={loading}
                className="w-full pl-8 pr-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold disabled:opacity-50"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Min: ₹{minAdvance}</span>
              <span>Max: ₹{maxAdvance}</span>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[30, 50, 75].map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() => setCustomAmount(Math.ceil(remainingAmount * (percent / 100)))}
                  disabled={loading}
                  className="px-3 py-2 bg-white border border-purple-300 rounded text-sm font-medium hover:bg-purple-100 disabled:opacity-50 transition-colors"
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Amount Breakdown */}
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Paying Now</span>
                <span className="font-bold text-purple-600">₹{customAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Remaining After</span>
                <span className="font-bold text-orange-600">₹{remainingAmount - customAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm font-medium text-blue-900 mb-2">Accepted Payment Methods</p>
          <div className="flex flex-wrap gap-2">
            {['Credit/Debit Cards', 'UPI', 'Net Banking', 'Wallets'].map((method) => (
              <span
                key={method}
                className="text-xs bg-white px-2 py-1 rounded border border-blue-200"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || customAmount <= 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Collect ₹{customAmount}
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;