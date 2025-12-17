// ============================================
// 6. OrderSummary.jsx - Order Details Summary
// ============================================
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
        <h3 className="font-semibold text-lg text-gray-900 mb-3">Items</h3>
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
            <span>GST ({order.gstDetails.cgst.rate ? 'CGST + SGST' : 'IGST'})</span>
            <span>₹{order.gstDetails.totalTax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span className="text-red-600">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Delivery Date & Time</p>
          <p className="font-semibold text-gray-900">{formatDate(order.orderDateTime)}</p>
        </div>

        {order.deliveryAddress && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
            <p className="font-medium text-gray-900">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
          </div>
        )}

        {order.specialInstructions && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Special Instructions</p>
            <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">{order.specialInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;