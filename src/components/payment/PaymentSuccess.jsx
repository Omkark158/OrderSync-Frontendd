// ============================================
// 2. PaymentSuccess.jsx - Payment Success Page
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Share2, Home, Package } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (orderDetails && orderDetails.invoice) {
      window.open(`/api/invoices/${orderDetails.invoice}/download`, '_blank');
    } else {
      alert('Invoice not available yet');
    }
  };

  const handleShareOrder = () => {
    if (navigator.share && orderDetails) {
      navigator.share({
        title: 'Order Confirmation',
        text: `My order ${orderDetails.orderNumber} from Sachin Foods has been confirmed!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <CheckCircle className="text-green-600 animate-bounce" size={80} />
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            {/* Order Number */}
            <div className="text-center pb-6 mb-6 border-b">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-3xl font-bold text-gray-900">{orderDetails.orderNumber}</p>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span className="font-semibold text-blue-600 capitalize">
                  {orderDetails.orderStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-900">₹{orderDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-green-600">₹{orderDetails.advancePayment}</span>
              </div>
              {orderDetails.remainingAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance Due (COD)</span>
                  <span className="font-semibold text-orange-600">₹{orderDetails.remainingAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-semibold text-green-600 capitalize">
                  {orderDetails.paymentStatus}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-blue-900 mb-2">Delivery Details</p>
              <p className="text-blue-800">
                {new Date(orderDetails.orderDateTime).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {orderDetails.deliveryAddress && (
                <p className="text-sm text-blue-700 mt-2">
                  {orderDetails.deliveryAddress.street}, {orderDetails.deliveryAddress.city}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <p className="font-semibold text-gray-900 mb-3">Order Items</p>
              <div className="space-y-2">
                {orderDetails.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
              >
                <Download size={18} />
                Invoice
              </button>
              <button
                onClick={handleShareOrder}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-bold text-lg text-gray-900 mb-3">What's Next?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>You'll receive an SMS confirmation shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Track your order status in "My Orders"</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>We'll notify you when your order is ready</span>
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <Package size={20} />
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help with your order?</p>
          <p className="mt-1">
            Call us at{' '}
            <a href="tel:9539387240" className="text-red-600 font-semibold hover:underline">
              9539387240
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;