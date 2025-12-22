// src/components/admin/OrderManager.jsx - FULLY FIXED VERSION

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Printer,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { invoiceService } from '../../services/invoiceService'; // ← NEW IMPORT

const OrderManager = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const getToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error(data.message || 'Failed to load order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading order');
    } finally {
      setLoading(false);
    }
  };

  // Confirm Order (Pending → Confirmed)
  const confirmOrder = async () => {
    setShowConfirmModal({
      title: 'Confirm Order',
      message: 'Are you sure you want to confirm this order? Customer will be notified via SMS.',
      onConfirm: async () => {
        setUpdating(true);
        const loadingToast = toast.loading('Confirming order...');
        try {
          const token = getToken();
          const res = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ orderStatus: 'confirmed' }),
          });
          const data = await res.json();
          toast.dismiss(loadingToast);
          
          if (data.success) {
            toast.success('Order confirmed successfully!');
            
            const smsToast = toast.loading('Sending confirmation SMS...');
            try {
              await fetch('/api/sms/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  phone: order.customerPhone,
                  orderNumber: order.orderNumber,
                  status: 'confirmed',
                }),
              });
              toast.dismiss(smsToast);
              toast.success('Confirmation SMS sent successfully!');
            } catch (smsErr) {
              toast.dismiss(smsToast);
              toast.error('Failed to send SMS notification');
            }
            
            fetchOrderDetails();
          } else {
            toast.error(data.message || 'Failed to confirm order');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Error confirming order');
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  // Deny / Cancel Order
  const denyOrder = async () => {
    setShowConfirmModal({
      title: 'Deny Order',
      message: 'Enter reason for denying this order:',
      requiresInput: true,
      inputPlaceholder: 'e.g., Out of stock, Invalid address...',
      onConfirm: async (reason) => {
        if (!reason?.trim()) {
          toast.error('Please provide a reason');
          return;
        }
        
        setUpdating(true);
        const loadingToast = toast.loading('Denying order...');
        try {
          const token = getToken();
          const res = await fetch(`/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ reason }),
          });
          const data = await res.json();
          toast.dismiss(loadingToast);
          
          if (data.success) {
            toast.success('Order denied successfully');
            
            const smsToast = toast.loading('Sending cancellation SMS...');
            try {
              await fetch('/api/sms/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  phone: order.customerPhone,
                  orderNumber: order.orderNumber,
                  status: 'cancelled',
                }),
              });
              toast.dismiss(smsToast);
              toast.success('Cancellation SMS sent successfully!');
            } catch (smsErr) {
              toast.dismiss(smsToast);
              toast.error('Failed to send SMS notification');
            }
            
            fetchOrderDetails();
          } else {
            toast.error(data.message || 'Failed to deny order');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Error denying order');
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  // Update Status (preparing, ready, delivered)
  const updateOrderStatus = async (newStatus) => {
    setShowConfirmModal({
      title: 'Update Order Status',
      message: `Change order status to "${newStatus}"?`,
      onConfirm: async () => {
        setUpdating(true);
        const loadingToast = toast.loading('Updating status...');
        try {
          const token = getToken();
          const res = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ orderStatus: newStatus }),
          });
          const data = await res.json();
          toast.dismiss(loadingToast);
          
          if (data.success) {
            toast.success(`Status updated to ${newStatus}!`);
            
            const smsToast = toast.loading('Sending status update SMS...');
            try {
              await fetch('/api/sms/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  phone: order.customerPhone,
                  orderNumber: order.orderNumber,
                  status: newStatus,
                }),
              });
              toast.dismiss(smsToast);
              toast.success('Status update SMS sent successfully!');
            } catch (smsErr) {
              toast.dismiss(smsToast);
              toast.error('Failed to send SMS notification');
            }
            
            fetchOrderDetails();
          } else {
            toast.error(data.message || 'Failed to update status');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Error updating status');
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  // Delete Order
  const deleteOrder = async () => {
    setShowConfirmModal({
      title: 'Delete Order',
      message: '⚠️ Permanently delete this order? This action cannot be undone!',
      isDangerous: true,
      onConfirm: async () => {
        const loadingToast = toast.loading('Deleting order...');
        try {
          const token = getToken();
          const res = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          toast.dismiss(loadingToast);
          if (data.success) {
            toast.success('Order deleted');
            navigate('/admin/orders');
          } else {
            toast.error(data.message || 'Failed to delete order');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Error deleting order');
        }
      },
    });
  };

  // Generate Invoice
  const generateInvoice = async () => {
    const loadingToast = toast.loading('Generating invoice...');
    setGeneratingInvoice(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/invoices/generate/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          billingAddress: order.billingAddress || order.deliveryAddress,
          shippingAddress: order.deliveryAddress,
          customerGSTIN: order.customerGSTIN || '',
          notes: "Don't waste food",
        }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success('Invoice generated successfully!');
        fetchOrderDetails();
      } else {
        toast.error(data.message || 'Failed to generate invoice');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Error generating invoice');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // ✅ FIXED: View Invoice - Now sends token and opens PDF properly
  const viewInvoice = async () => {
    try {
      await invoiceService.viewInvoice(order.invoice);
    } catch (error) {
      toast.error('Failed to open invoice. Please try again.');
      console.error('View invoice error:', error);
    }
  };

  // ✅ FIXED: Download Invoice - Now sends token and downloads correctly
  const downloadInvoice = async () => {
    const loadingToast = toast.loading('Downloading invoice...');
    try {
      await invoiceService.downloadInvoice(order.invoice);
      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to download invoice');
      console.error('Download invoice error:', error);
    }
  };

  // Share via WhatsApp (public link - no auth needed)
  const shareInvoiceWhatsApp = () => {
    const phone = order.customerPhone.replace(/^\+91/, '').replace(/\s/g, '');
    const invoiceUrl = `${window.location.origin}/api/invoices/${order.invoice}/download`;
    const message = encodeURIComponent(
      `Hi ${order.customerName}!\n\nYour invoice for Order *${order.orderNumber}* is ready.\n\nTotal Amount: ₹${order.totalAmount}\n\nDownload Invoice: ${invoiceUrl}\n\nThank you!\nSachin Foods\n9539387240, 9388808825`
    );
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
  };

  // Send Invoice via SMS
  const sendInvoiceSMS = async () => {
    setShowConfirmModal({
      title: 'Send Invoice via SMS',
      message: 'Send invoice download link to customer via SMS?',
      onConfirm: async () => {
        const loadingToast = toast.loading('Sending SMS...');
        try {
          const token = getToken();
          const invoiceUrl = `${window.location.origin}/api/invoices/${order.invoice}/download`;

          const response = await fetch('/api/sms/send-invoice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              phone: order.customerPhone,
              orderNumber: order.orderNumber,
              invoiceUrl,
              customerName: order.customerName,
              totalAmount: order.totalAmount,
            }),
          });

          const data = await response.json();
          toast.dismiss(loadingToast);

          if (data.success) {
            toast.success('Invoice SMS sent successfully!');
          } else {
            toast.error(data.message || 'Failed to send SMS');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Error sending SMS');
          console.error('SMS Error:', err);
        }
      },
    });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-center">
        <p className="text-2xl text-red-600">Order not found</p>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg">
          Back to Orders
        </button>
      </div>
    );

  const nextStatuses = ['preparing', 'ready', 'delivered'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {showConfirmModal && (
        <ConfirmModal
          {...showConfirmModal}
          onClose={() => setShowConfirmModal(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {isAdmin && ['delivered', 'cancelled'].includes(order.orderStatus) && (
          <button onClick={deleteOrder} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar size={16} />
              Placed: {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold uppercase ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm flex items-center gap-2 mt-1">
              <Phone size={14} className="text-red-600" />
              {order.customerPhone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery</p>
            <p className="font-semibold text-red-600">{formatDate(order.orderDateTime)}</p>
            {order.isFutureOrder && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Future</span>}
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="border-t pt-6 mt-6">
            <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-red-600" />
              Delivery Address
            </p>
            <p className="font-medium">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}
              {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
              {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
            </p>
          </div>
        )}
      </div>

      {/* Items & Total */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        {order.orderItems.map((item, i) => (
          <div key={i} className="flex justify-between py-3 border-b last:border-0">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
            </div>
            <p className="font-bold">₹{item.subtotal}</p>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="flex justify-between text-xl font-bold text-red-600">
            <span>Total Amount</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Advance Paid</span>
            <span className="text-green-600">₹{order.advancePayment || 0}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Balance Due</span>
            <span className="text-orange-600">₹{order.remainingAmount || 0}</span>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <>
          {order.orderStatus === 'pending' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Decision</h2>
              <div className="flex gap-4">
                <button
                  onClick={confirmOrder}
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  <CheckCircle size={20} />
                  Confirm Order
                </button>
                <button
                  onClick={denyOrder}
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
                >
                  <XCircle size={20} />
                  Deny Order
                </button>
              </div>
            </div>
          )}

          {['confirmed', 'preparing', 'ready'].includes(order.orderStatus) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Update Status</h2>
              <div className="flex flex-wrap gap-3">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={updating || order.orderStatus === status}
                    className={`px-5 py-2.5 rounded-lg capitalize font-medium ${
                      order.orderStatus === status ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Invoice Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Invoice</h2>

        {order.invoiceGenerated && order.invoice ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">✓ Invoice Generated</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={viewInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <FileText size={20} />
                View Invoice
              </button>

              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                <Printer size={20} />
                Download PDF
              </button>

              <button
                onClick={shareInvoiceWhatsApp}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </button>

              {isAdmin && (
                <button
                  onClick={sendInvoiceSMS}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  <Phone size={20} />
                  Send via SMS
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">Invoice not generated yet</p>
            </div>

            {isAdmin && order.orderStatus === 'confirmed' && (
              <button
                onClick={generateInvoice}
                disabled={generatingInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
              >
                <FileText size={20} />
                {generatingInvoice ? 'Generating...' : 'Generate Invoice'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmModal = ({ title, message, onConfirm, onClose, requiresInput, inputPlaceholder, isDangerous }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(requiresInput ? inputValue : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {requiresInput && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            autoFocus
          />
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-lg font-medium text-white ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;