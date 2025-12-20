// components/order/OrderSummary.jsx - Complete
import { Calendar, MapPin, Package, CreditCard } from 'lucide-react';

const OrderSummary = ({ order }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Success Message */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-800">Order Placed Successfully!</h3>
            <p className="text-sm text-green-700">Your order has been confirmed and is being processed</p>
          </div>
        </div>
      </div>

      {/* Order Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-lg font-semibold uppercase text-sm ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <Package size={20} className="text-red-600" />
          Items Ordered
        </h3>
        <div className="space-y-3">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">₹{item.subtotal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>₹{order.subtotal || order.totalAmount}</span>
        </div>
        {order.gstDetails && order.gstDetails.totalTax > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>GST ({order.gstDetails.cgst?.rate ? 'CGST + SGST' : 'IGST'})</span>
            <span>₹{order.gstDetails.totalTax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
          <span>Total Amount</span>
          <span className="text-red-600">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-red-600 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600 mb-1">Delivery Date & Time</p>
            <p className="font-semibold text-gray-900">{formatDate(order.orderDateTime)}</p>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="text-red-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
              <p className="font-medium text-gray-900">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>
        )}

        {order.paymentMethod && (
          <div className="flex items-start gap-3">
            <CreditCard className="text-red-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
            </div>
          </div>
        )}

        {order.specialInstructions && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Special Instructions</p>
            <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-6 border-t">
        <button
          onClick={() => window.location.href = '/orders'}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
        >
          View All Orders
        </button>
        <button
          onClick={() => window.location.href = '/menu'}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;