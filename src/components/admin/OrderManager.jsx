// OrderManager.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Printer, Phone, MapPin, Calendar } from 'lucide-react';

const OrderManager = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        alert('Failed to load order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error loading order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully!');
        fetchOrderDetails();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const generateInvoice = async () => {
    if (!window.confirm('Generate invoice for this order?')) return;

    setGeneratingInvoice(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/generate/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          billingAddress: order.billingAddress || order.deliveryAddress,
          shippingAddress: order.deliveryAddress,
          customerGSTIN: order.customerGSTIN || '',
          notes: "Don't waste food",
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Invoice generated successfully!');
        fetchOrderDetails();
      } else {
        alert(data.message || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const downloadInvoice = () => {
    if (order.invoice) {
      window.open(`/api/invoices/${order.invoice}/download`, '_blank');
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-red-600">Order not found</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Orders</span>
      </button>

      {/* Order Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar size={16} />
              Order placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Customer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Customer Name</p>
            <p className="font-semibold text-gray-900">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Phone</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Phone size={16} className="text-red-600" />
              {order.customerPhone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-semibold text-gray-900">
              {order.customerEmail || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Delivery Date & Time</p>
            <p className="font-semibold text-red-600">
              {formatDate(order.orderDateTime)}
            </p>
            {order.isFutureOrder && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Future Order
              </span>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-red-600" />
              Delivery Address
            </p>
            <p className="font-medium text-gray-900">
              {order.deliveryAddress.street}
              {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
              {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
              {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
            </p>
          </div>
        )}

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Special Instructions</p>
            <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">
              {order.specialInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Order Items Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ₹{item.price} × {item.quantity} pcs
                </p>
              </div>
              <p className="font-bold text-gray-900 text-lg">₹{item.subtotal}</p>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>

          {/* GST Details */}
          {order.gstDetails && order.gstDetails.totalTax > 0 && (
            <>
              {order.gstDetails.cgst.amount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>CGST ({order.gstDetails.cgst.rate}%)</span>
                  <span>₹{order.gstDetails.cgst.amount.toFixed(2)}</span>
                </div>
              )}
              {order.gstDetails.sgst.amount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>SGST ({order.gstDetails.sgst.rate}%)</span>
                  <span>₹{order.gstDetails.sgst.amount.toFixed(2)}</span>
                </div>
              )}
              {order.gstDetails.igst.amount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IGST ({order.gstDetails.igst.rate}%)</span>
                  <span>₹{order.gstDetails.igst.amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-gray-700 pt-2 border-t">
                <span>Total Tax</span>
                <span>₹{order.gstDetails.totalTax.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className="flex justify-between text-xl font-bold text-red-600 pt-3 border-t-2 border-gray-300">
            <span>Total Amount</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {/* Payment Details */}
          <div className="pt-3 border-t space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Advance Payment</span>
              <span className="text-green-600 font-medium">
                ₹{order.advancePayment}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Balance Due</span>
              <span className="text-orange-600">₹{order.remainingAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Status</span>
              <span
                className={`font-medium ${
                  order.paymentStatus === 'completed'
                    ? 'text-green-600'
                    : order.paymentStatus === 'partial'
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h2>
        <p className="text-sm text-gray-600 mb-4">
          Change the order status to track progress
        </p>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateOrderStatus(status)}
              disabled={updating || order.orderStatus === status}
              className={`px-5 py-2.5 rounded-lg capitalize font-medium transition-all ${
                order.orderStatus === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updating && order.orderStatus !== status ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  Updating...
                </span>
              ) : (
                status
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Management Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Management</h2>

        {order.invoiceGenerated ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium mb-1">
                ✓ Invoice Generated
              </p>
              <p className="text-sm text-green-700">
                Invoice has been created for this order
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/invoices/${order.invoice}`)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={20} />
                View Invoice
              </button>
              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={20} />
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-1">
                Invoice Not Generated
              </p>
              <p className="text-sm text-yellow-700">
                {order.orderStatus !== 'confirmed'
                  ? 'Please confirm the order first before generating invoice'
                  : 'Click the button below to generate invoice'}
              </p>
            </div>
            <button
              onClick={generateInvoice}
              disabled={order.orderStatus !== 'confirmed' || generatingInvoice}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generatingInvoice ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;