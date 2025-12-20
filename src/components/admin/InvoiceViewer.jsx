// components/admin/InvoiceViewer.jsx - Complete invoice viewer
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const InvoiceViewer = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const getToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const fetchInvoice = async () => {
    try {
      const token = getToken();
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setInvoice(data.data);
      } else {
        toast.error(data.message || 'Failed to load invoice');
      }
    } catch (error) {
      console.error('Failed to load invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const loadingToast = toast.loading('Downloading...');
    try {
      const token = getToken();
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success('Invoice downloaded!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Download failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!invoice) return;
    
    const url = `${window.location.origin}/api/invoices/${invoiceId}/download`;
    
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice.invoiceNumber}`,
        text: `Invoice for ₹${invoice.totalAmount}`,
        url: url,
      }).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Invoice link copied to clipboard');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-700',
      partial: 'bg-orange-100 text-orange-700',
      paid: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer size={18} />
            Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SACHIN FOODS</h1>
            <p className="text-gray-600">Kundara, Kollam, Kerala</p>
            <p className="text-gray-600">Mobile: 9539387240, 9388808825</p>
            <p className="text-gray-600">GSTIN: 32BMDPB7722C1ZR</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Invoice #{invoice.invoiceNumber}
            </h2>
            <p className="text-sm text-gray-600">
              Date: {formatDate(invoice.invoiceDate)}
            </p>
            <div className="flex gap-2 mt-2 justify-end">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                {invoice.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(invoice.paymentStatus)}`}>
                {invoice.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">BILL TO</h3>
            <p className="font-medium">{invoice.customerName}</p>
            <p className="text-sm text-gray-600">Phone: {invoice.customerPhone}</p>
            {invoice.customerEmail && (
              <p className="text-sm text-gray-600">Email: {invoice.customerEmail}</p>
            )}
            {invoice.billingAddress && (
              <div className="text-sm text-gray-600 mt-2">
                <p>{invoice.billingAddress.street}</p>
                <p>
                  {invoice.billingAddress.city}, {invoice.billingAddress.state} - {invoice.billingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">SHIP TO</h3>
            <p className="font-medium">{invoice.customerName}</p>
            {invoice.shippingAddress && (
              <div className="text-sm text-gray-600">
                <p>{invoice.shippingAddress.street}</p>
                <p>
                  {invoice.shippingAddress.city}, {invoice.shippingAddress.state}
                </p>
                {invoice.shippingAddress.pincode && (
                  <p>PIN: {invoice.shippingAddress.pincode}</p>
                )}
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              <strong>Delivery:</strong> {formatDate(invoice.deliveryDate)}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left p-3 font-semibold">ITEMS</th>
                <th className="text-center p-3 font-semibold">QTY</th>
                <th className="text-right p-3 font-semibold">RATE</th>
                <th className="text-right p-3 font-semibold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="text-center p-3">{item.quantity}</td>
                  <td className="text-right p-3">₹{item.rate}</td>
                  <td className="text-right p-3 font-medium">₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-1/2">
            <h4 className="font-semibold text-gray-900 mb-2">NOTES</h4>
            <p className="text-sm text-gray-600">{invoice.notes || "Don't waste food"}</p>

            {invoice.termsAndConditions && invoice.termsAndConditions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">TERMS AND CONDITIONS</h4>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                  {invoice.termsAndConditions.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>

              {invoice.taxDetails && invoice.taxDetails.totalTax > 0 && (
                <>
                  {invoice.taxDetails.cgst.amount > 0 && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>CGST ({invoice.taxDetails.cgst.rate}%)</span>
                      <span>₹{invoice.taxDetails.cgst.amount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxDetails.sgst.amount > 0 && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>SGST ({invoice.taxDetails.sgst.rate}%)</span>
                      <span>₹{invoice.taxDetails.sgst.amount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxDetails.igst.amount > 0 && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>IGST ({invoice.taxDetails.igst.rate}%)</span>
                      <span>₹{invoice.taxDetails.igst.amount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between py-2 border-t-2 border-gray-300">
                <span className="font-bold text-lg">TOTAL AMOUNT</span>
                <span className="font-bold text-xl text-red-600">
                  ₹{invoice.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Received Amount</span>
                <span className="text-green-600 font-medium">
                  ₹{invoice.receivedAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Balance</span>
                <span className={`font-medium ${invoice.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  ₹{invoice.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mb-6 pb-6 border-b">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Total Amount (in words)
          </p>
          <p className="text-sm text-gray-700">
            {invoice.getAmountInWords ? invoice.getAmountInWords() : 'Amount in words not available'}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="font-bold text-lg text-gray-900">
            {invoice.invoiceType === 'tax_invoice' ? 'TAX INVOICE ORIGINAL' :
             invoice.invoiceType === 'cash_sale' ? 'CASH SALE ORIGINAL' :
             'BILL OF SUPPLY ORIGINAL'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;