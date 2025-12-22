import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Calendar, Phone, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders } = useOrder();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    console.log('📦 OrderHistory: Loading orders...');
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const result = await fetchOrders();
    if (result.success) {
      console.log('✅ Orders loaded:', result.orders.length);
    } else {
      console.error('❌ Failed to load orders:', result.message);
    }
  };

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
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      preparing: 'bg-purple-100 text-purple-700 border-purple-300',
      ready: 'bg-green-100 text-green-700 border-green-300',
      delivered: 'bg-gray-100 text-gray-700 border-gray-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === statusFilter);

  // Handle card click - navigate to order details
  const handleOrderClick = (orderId) => {
    toast.loading('Loading order details...', { duration: 300 });
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  toast.loading(`Filtering ${status} orders...`, { duration: 300 });
                }}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status === 'all' ? `All Orders (${orders.length})` : status}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-20 h-20 mx-auto" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all'
                ? "You haven't placed any orders yet. Start by browsing our delicious menu!"
                : `You don't have any ${statusFilter} orders at the moment.`}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock size={14} />
                      Placed {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Customer & Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer</p>
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone size={14} />
                      {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar size={14} className="text-red-600" />
                      Delivery Time
                    </p>
                    <p className="font-semibold text-red-600">
                      {formatDate(order.orderDateTime)}
                    </p>
                    {order.isFutureOrder && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        Future Order
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Order Items:</p>
                  <div className="space-y-2">
                    {order.orderItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">
                          {item.name} <span className="text-gray-500">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-900">₹{item.subtotal}</span>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="text-sm text-blue-600 font-medium">
                        +{order.orderItems.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Total Amount Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-red-600">₹{order.totalAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">
                      Payment: <span className={`font-semibold ${
                        order.paymentStatus === 'completed' ? 'text-green-600' :
                        order.paymentStatus === 'partial' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </p>
                    {order.advancePayment > 0 && (
                      <p className="text-xs text-gray-500">
                        Paid: <span className="font-semibold text-green-600">₹{order.advancePayment}</span>
                      </p>
                    )}
                    {order.remainingAmount > 0 && (
                      <p className="text-xs text-gray-500">
                        Due: <span className="font-semibold text-orange-600">₹{order.remainingAmount}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Instructions (if any) */}
                {order.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Special Instructions:</p>
                    <p className="text-sm text-gray-900 bg-yellow-50 p-2 rounded">
                      {order.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.orderStatus === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-red-600">
                ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;