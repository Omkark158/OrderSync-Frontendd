import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Printer, ArrowLeft, Share2 } from 'lucide-react';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Bill = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [orderId]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/order/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setInvoice(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (invoice) {
      window.open(`/api/invoices/${invoice._id}/download`, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoice.invoiceNumber}`,
        text: `My invoice from Sachin Foods`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading invoice..." />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Invoice not found</h2>
          <p className="text-slate-600 mb-6">We couldn't find the invoice you're looking for.</p>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Action Bar - Hidden on Print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button
            onClick={() => navigate('/orders')}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 size={18} />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 print:shadow-none print:border-0">
          {/* Company Header */}
          <div className="text-center mb-8 pb-8 border-b-2 border-slate-200">
            <h1 className="text-4xl font-bold text-blue-600 mb-3">SACHIN FOODS</h1>
            <p className="text-sm text-slate-600">Manufacturing & Marketing of Chappathy, Appam</p>
            <p className="text-sm text-slate-600">Veesappam, Pathiri, Arippathiri & Bakery Items</p>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-slate-600">Kundara, Kollam</p>
              <p className="text-sm text-slate-600">Ph: 9539387240, 9388808825, 8547828825</p>
              <p className="text-sm text-slate-600 font-medium">GSTIN: 32BMDPB7722C1ZR</p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">TAX INVOICE</h2>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-slate-600 mb-1">Invoice Number</p>
              <p className="text-lg font-bold text-slate-900">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Invoice Date</p>
              <p className="text-lg font-bold text-slate-900">
                {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-slate-50 rounded-lg">
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Bill To</h3>
              <p className="font-semibold text-slate-900 text-lg mb-1">{invoice.customerName}</p>
              <p className="text-slate-600 text-sm">Mobile: {invoice.customerPhone}</p>
              {invoice.billingAddress && (
                <div className="mt-2 text-sm text-slate-600">
                  <p>{invoice.billingAddress.street}</p>
                  <p>{invoice.billingAddress.city}, {invoice.billingAddress.state}</p>
                  <p>{invoice.billingAddress.pincode}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Ship To</h3>
              <p className="font-semibold text-slate-900 text-lg mb-1">{invoice.customerName}</p>
              {invoice.shippingAddress && (
                <div className="mt-2 text-sm text-slate-600">
                  <p>{invoice.shippingAddress.street}</p>
                  <p>{invoice.shippingAddress.city}, {invoice.shippingAddress.state}</p>
                  <p>{invoice.shippingAddress.pincode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">ITEM DESCRIPTION</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm">QTY</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 text-sm">RATE</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 text-sm">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-4 text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-center text-slate-900">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-slate-900">₹{item.rate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-96 space-y-3">
              <div className="flex justify-between py-2 text-slate-700">
                <span>Subtotal</span>
                <span className="font-semibold">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              
              {/* Tax Details */}
              {invoice.taxDetails && invoice.taxDetails.totalTax > 0 && (
                <div className="space-y-2 py-2 border-t border-slate-200">
                  {invoice.taxDetails.cgst && invoice.taxDetails.cgst.amount > 0 && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>CGST ({invoice.taxDetails.cgst.rate}%)</span>
                      <span>₹{invoice.taxDetails.cgst.amount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxDetails.sgst && invoice.taxDetails.sgst.amount > 0 && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>SGST ({invoice.taxDetails.sgst.rate}%)</span>
                      <span>₹{invoice.taxDetails.sgst.amount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxDetails.igst && invoice.taxDetails.igst.amount > 0 && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>IGST ({invoice.taxDetails.igst.rate}%)</span>
                      <span>₹{invoice.taxDetails.igst.amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Grand Total */}
              <div className="flex justify-between py-3 border-t-2 border-slate-300">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{invoice.totalAmount.toFixed(2)}</span>
              </div>

              {/* Payment Details */}
              {invoice.receivedAmount > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="flex justify-between text-green-700">
                    <span>Received Amount</span>
                    <span className="font-semibold">₹{invoice.receivedAmount.toFixed(2)}</span>
                  </div>
                  {invoice.balanceAmount > 0 && (
                    <div className="flex justify-between text-orange-700">
                      <span>Balance Due</span>
                      <span className="font-semibold">₹{invoice.balanceAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          {invoice.paymentMethod && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Payment Method:</span> {invoice.paymentMethod}
              </p>
              {invoice.paymentStatus && (
                <p className="text-sm text-slate-700 mt-1">
                  <span className="font-semibold">Payment Status:</span>{' '}
                  <span className={`font-semibold ${
                    invoice.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {invoice.paymentStatus.toUpperCase()}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Terms & Conditions</h3>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• All goods once sold will not be taken back or exchanged</li>
              <li>• Goods remain the property of Sachin Foods until fully paid</li>
              <li>• Interest @ 18% will be charged on delayed payments</li>
              <li>• Disputes are subject to Kollam jurisdiction only</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-600 mb-2">Customer Signature</p>
                <div className="w-48 border-b-2 border-slate-300 h-12"></div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 mb-4">For Sachin Foods</p>
                <div className="w-48 border-b-2 border-slate-300 h-12 ml-auto"></div>
                <p className="text-xs text-slate-600 mt-2">Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              This is a computer-generated invoice and does not require a physical signature
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for your business!
            </p>
          </div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:border-0 {
              border: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Bill;