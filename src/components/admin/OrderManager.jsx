// OrderManager.jsx - FIXED with toasts and production URLs
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Printer, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast'; // ✅ Import toast

const OrderManager = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const isAdmin = user?.role === 'admin';

  // ✅ Helper to get production URL
  const getProductionUrl = () => {
    // Use environment variable if available, otherwise use current origin
    return import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  };

  useEffect(() => {
    console.log('👤 Current user:', user);
    console.log('🔑 Is admin?', isAdmin);
  }, [user, isAdmin]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error(data.message || 'Failed to load order'); // ✅ Toast
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Error loading order details'); // ✅ Toast
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    if (!isAdmin) {
      toast.error('Only administrators can update order status'); // ✅ Toast
      return;
    }

    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;

    setUpdating(true);
    const loadingToast = toast.loading('Updating order status...'); // ✅ Loading toast
    
    try {
      const token = getToken();
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast); // ✅ Dismiss loading
      
      if (data.success) {
        toast.success('Order status updated successfully!'); // ✅ Success toast
        fetchOrderDetails();
      } else {
        toast.error(data.message || 'Failed to update status'); // ✅ Error toast
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.dismiss(loadingToast);
      toast.error('Error updating order status'); // ✅ Error toast
    } finally {
      setUpdating(false);
    }
  };

  const generateInvoice = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can generate invoices'); // ✅ Toast
      return;
    }

    if (!window.confirm('Generate invoice for this order?')) return;

    setGeneratingInvoice(true);
    const loadingToast = toast.loading('Generating invoice...'); // ✅ Loading toast
    
    try {
      const token = getToken();
      
      console.log('🔍 Generating invoice for order:', orderId);
      
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
      toast.dismiss(loadingToast); // ✅ Dismiss loading
      
      if (data.success) {
        console.log('✅ Invoice generated:', data.data);
        toast.success('Invoice generated successfully!'); // ✅ Success toast
        fetchOrderDetails();
      } else {
        console.error('❌ Invoice generation failed:', data.message);
        toast.error(data.message || 'Failed to generate invoice'); // ✅ Error toast
      }
    } catch (error) {
      console.error('❌ Error generating invoice:', error);
      toast.dismiss(loadingToast);
      toast.error('Error generating invoice'); // ✅ Error toast
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const downloadInvoice = async () => {
    if (!order.invoice) {
      toast.error('No invoice available'); // ✅ Toast
      return;
    }

    const loadingToast = toast.loading('Downloading invoice...'); // ✅ Loading toast
    
    try {
      const token = getToken();
      const response = await fetch(`/api/invoices/${order.invoice}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      // Get filename
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `invoice_${order.orderNumber}.pdf`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded successfully!'); // ✅ Success toast
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to download invoice'); // ✅ Error toast
    }
  };

  // ✅ FIXED: Share invoice via WhatsApp with production URL
  const shareInvoiceWhatsApp = () => {
    if (!order.invoice) {
      toast.error('No invoice available to share'); // ✅ Toast
      return;
    }
    
    const phone = order.customerPhone.replace(/^\+91/, '').replace(/\s/g, '');
    
    // ✅ Use production URL, not localhost
    const productionUrl = getProductionUrl();
    const invoiceUrl = `${productionUrl}/api/invoices/${order.invoice}/download`;
    
    const message = encodeURIComponent(
      `Hi ${order.customerName}!\n\nYour invoice for Order ${order.orderNumber} is ready.\n\nTotal Amount: ₹${order.totalAmount}\nDownload Invoice: ${invoiceUrl}\n\nThank you for choosing Sachin Foods!\nContact: 9539387240, 9388808825`
    );
    
    const whatsappUrl = `https://wa.me/91${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...'); // ✅ Toast
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
          onClick={() => navigate(isAdmin ? '/admin/orders' : '/orders')}
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
        onClick={() => navigate(isAdmin ? '/admin/orders' : '/orders')}
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

      {/* Status Update Card - ADMIN ONLY */}
      {isAdmin && (
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
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

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
            <div className="flex gap-3 flex-wrap">
              {isAdmin && (
                <button
                  onClick={() => navigate(`/admin/invoices/${order.invoice}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText size={20} />
                  View Invoice
                </button>
              )}
              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Printer size={20} />
                Download PDF
              </button>
              <button
                onClick={shareInvoiceWhatsApp}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share via WhatsApp
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
                {isAdmin
                  ? order.orderStatus !== 'confirmed'
                    ? 'Please confirm the order first before generating invoice'
                    : 'Click the button below to generate invoice'
                  : 'Invoice will be generated by admin once order is confirmed'}
              </p>
            </div>
            {isAdmin && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;