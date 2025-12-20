// pages/user/OrderHistory.jsx - FINAL WORKING VERSION (with all imports!)
import { useEffect, useState } from 'react';  // ← Added useState here!
import { useNavigate } from 'react-router-dom';
import { Package, Calendar } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import Loader from '../../components/common/Loader';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders } = useOrder();
  const [filter, setFilter] = useState('all');  // Now useState is defined!

  useEffect(() => {
    fetchOrders();  // Fetch fresh orders every time page loads
  }, [fetchOrders]);

  const filteredOrders = Array.isArray(orders)
    ? filter === 'all'
      ? orders
      : orders.filter(order => order?.orderStatus === filter)
    : [];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      denied: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {/* No Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={80} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">Start ordering delicious food!</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.orderNumber || `Order #${order._id.slice(-6)}`}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                  <div className="space-y-1">
                    {(order.orderItems || []).slice(0, 5).map((item, idx) => (
                      <p key={idx} className="text-gray-700">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                    {order.orderItems?.length > 5 && (
                      <p className="text-sm text-gray-500">+{order.orderItems.length - 5} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-red-600">₹{order.totalAmount}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;