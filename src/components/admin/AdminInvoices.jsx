// src/components/admin/AdminInvoices.jsx - WITH CUSTOM CONFIRM DIALOG
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone, ArrowLeft, Eye, Trash2, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // ✅ State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    invoice: null,
  });

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const getToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Admin session expired. Please login again.');
      navigate('/admin/secure-access');
      return null;
    }
    return token;
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error('Authentication required');
        navigate('/admin/secure-access');
        return;
      }

      let url = '/api/invoices';
      if (filter !== 'all') {
        url += `?paymentStatus=${filter}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to load invoices');
      }

      const data = await response.json();
      if (data.success) {
        const sorted = data.data.sort((a, b) => 
          new Date(b.invoiceDate || b.createdAt) - new Date(a.invoiceDate || a.createdAt)
        );
        setInvoices(sorted);
        toast.success(`Loaded ${sorted.length} invoices`);
      } else {
        toast.error(data.message || 'Failed to load');
        setInvoices([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = (invoice) => {
    const orderStatus = invoice.order?.orderStatus;
    
    if (orderStatus !== 'delivered') {
      toast.error('Cannot delete invoice. Order must be delivered first.', {
        duration: 4000,
      });
      return;
    }

    setDeleteModal({
      isOpen: true,
      invoice,
    });
  };

  // ✅ Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      invoice: null,
    });
  };

  // ✅ Confirm delete
  const confirmDelete = async () => {
    const invoice = deleteModal.invoice;
    if (!invoice) return;

    const loadingToast = toast.loading('Deleting invoice...');
    
    try {
      const token = getToken();
      const response = await fetch(`/api/invoices/${invoice._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success || response.ok) {
        toast.success(`Invoice #${invoice.invoiceNumber} deleted successfully`);
        setInvoices(invoices.filter(inv => inv._id !== invoice._id));
        closeDeleteModal();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error deleting invoice');
      console.error(error);
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
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-orange-100 text-orange-700';
      case 'unpaid': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
        <p className="text-gray-600 mt-1">View and manage all generated invoices</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'paid', 'partial', 'unpaid'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
              filter === status
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status === 'all' ? 'All Invoices' : status}
          </button>
        ))}
      </div>

      {/* Invoices Cards */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'No invoices have been generated yet.' : `No ${filter} invoices.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {formatDate(invoice.invoiceDate || invoice.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getStatusColor(invoice.paymentStatus)}`}>
                  {invoice.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-900">{invoice.customerName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone size={14} />
                    {invoice.customerPhone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Linked Order</p>
                  <p className="font-medium text-gray-900">
                    {invoice.order?.orderNumber || 'N/A'}
                  </p>
                  {invoice.order?.orderStatus && (
                    <p className="text-xs text-gray-500 mt-1">
                      Status: <span className="capitalize">{invoice.order.orderStatus}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-red-600">₹{invoice.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Balance: <span className={invoice.balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                      ₹{invoice.balance.toFixed(2)}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/invoices/${invoice._id}`)}
                    className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() => openDeleteModal(invoice)}
                    disabled={invoice.order?.orderStatus !== 'delivered'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      invoice.order?.orderStatus !== 'delivered'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title={invoice.order?.orderStatus !== 'delivered' ? 'Order must be delivered to delete invoice' : 'Delete invoice'}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            {/* Warning icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={32} />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Invoice?
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to permanently delete Invoice{' '}
              <span className="font-semibold text-gray-900">
                #{deleteModal.invoice?.invoiceNumber}
              </span>
              ?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ This action cannot be undone. The invoice will be permanently removed from the system.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;