// ============================================
// 4. AdminOrders.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Calendar, Phone, MapPin, Clock, FileText } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? '/api/orders' 
        : `/api/orders?status=${statusFilter}`;
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-gray-600 mt-1">
          View and manage all customer orders
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          )
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    <Clock size={14} className="inline mr-1" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Phone size={14} className="inline mr-1" />
                    {order.customerPhone}
                  </p>
                </div>
                {order.deliveryAddress && (
                  <div className="text-sm text-gray-600">
                    <MapPin size={14} className="inline mr-1" />
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </div>
                )}
              </div>

              {/* Delivery Date */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-red-600" />
                  Delivery Date: {formatDate(order.orderDateTime)}
                </p>
                {order.isFutureOrder && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    Future Order
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                <div className="space-y-1">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-red-600">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    Payment: {order.paymentStatus}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = `/admin/orders/${order._id}`}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    View Details
                  </button>
                  {!order.invoiceGenerated && order.orderStatus === 'confirmed' && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <FileText size={16} />
                      Generate Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;