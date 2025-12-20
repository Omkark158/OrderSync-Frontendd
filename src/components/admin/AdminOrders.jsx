// ============================================
// AdminOrders.jsx - FIXED with Toast Notifications
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone, MapPin, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast'; // ✅ Import toast

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required'); // ✅ Toast
        navigate('/admin/secure-access');
        return;
      }
      
      const url = statusFilter === 'all' 
        ? '/api/orders' 
        : `/api/orders?status=${statusFilter}`;
      
      console.log('📡 Fetching orders:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again'); // ✅ Toast
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/secure-access');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders data:', data);
      
      if (data.success) {
        setOrders(data.data || []);
        if (data.data && data.data.length > 0) {
          toast.success(`Loaded ${data.data.length} orders`); // ✅ Toast
        }
      } else {
        console.error('Failed to fetch orders:', data.message);
        toast.error(data.message || 'Failed to fetch orders'); // ✅ Toast
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders. Please try again.'); // ✅ Toast
      setOrders([]);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">
          View and manage all customer orders
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(
          (status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                toast.loading(`Loading ${status} orders...`, { duration: 500 }); // ✅ Toast
              }}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          )
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? 'No orders have been placed yet.' 
              : `No ${statusFilter} orders at the moment.`}
          </p>
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
                  <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone size={14} />
                    {order.customerPhone}
                  </p>
                </div>
                {order.deliveryAddress && (
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="text-sm text-gray-900 flex items-start gap-1">
                      <MapPin size={14} className="mt-1 flex-shrink-0" />
                      <span>
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Date */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-red-600" />
                  Delivery: <span className="text-red-600">{formatDate(order.orderDateTime)}</span>
                </p>
                {order.isFutureOrder && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    Future Order
                  </span>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                <div className="space-y-1">
                  {order.orderItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.subtotal}</span>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      +{order.orderItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-red-600">₹{order.totalAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment: <span className={`font-medium ${
                      order.paymentStatus === 'completed' ? 'text-green-600' :
                      order.paymentStatus === 'partial' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast.loading('Loading order details...', { duration: 300 }); // ✅ Toast
                      navigate(`/admin/orders/${order._id}`);
                    }}
                    className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  {!order.invoiceGenerated && order.orderStatus === 'confirmed' && (
                    <button
                      onClick={() => {
                        toast.info('Navigate to order to generate invoice'); // ✅ Toast
                        navigate(`/admin/orders/${order._id}`);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                    >
                      <FileText size={16} />
                      Invoice
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