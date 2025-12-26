// pages/user/CreateOrder.jsx - FULLY FIXED & PRODUCTION-READY
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import OrderSummary from '../../components/order/OrderSummary';
import { paymentService } from '../../services/paymentService';
import { Calendar, MapPin, CreditCard, Clock, Wallet, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, createOrder, fetchOrders, clearCart } = useOrder();
  const { user } = useAuth();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: 'Pickup from Store',
      city: 'Kundara',
      state: 'Kerala',
      pincode: '691501',
    },
    orderDate: '',
    orderTime: '',
    customAdvanceAmount: Math.ceil(getCartTotal() / 2),
    specialInstructions: '',
    paymentOption: 'cash_on_pickup', // default
  });

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty');
      navigate('/menu');
    }
  }, [cart, navigate, orderPlaced]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, orderDate: today }));
  }, []);

  useEffect(() => {
    const total = getCartTotal();
    if (formData.paymentOption === 'online_advance') {
      setFormData(prev => ({
        ...prev,
        customAdvanceAmount: Math.ceil(total / 2),
      }));
    }
  }, [formData.paymentOption, getCartTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Called ONLY after Razorpay payment is verified on backend
  const handlePaymentSuccess = async (paymentData) => {
    console.log('✅ Payment verified & successful:', paymentData);

    toast.success('🎉 Payment successful! Your order has been confirmed.');

    await fetchOrders(); // Refresh order list
    setOrderPlaced(true);
    setPlacedOrder(paymentData.order);
    clearCart();
    setLoading(false);
  };

  const handlePaymentFailure = (error) => {
    console.error('❌ Payment failed:', error);
    toast.error('Payment failed. Your order is saved but not confirmed yet. You can pay later.');
    setLoading(false);

    // Optionally redirect to orders page so user can pay remaining later
    // navigate('/orders');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orderDate || !formData.orderTime) {
      toast.error('Please select pickup date and time');
      return;
    }

    const orderDateTime = new Date(`${formData.orderDate}T${formData.orderTime}:00`);

    if (orderDateTime < new Date()) {
      toast.error('Pickup time must be in the future');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        deliveryAddress: formData.deliveryAddress,
        orderDateTime: orderDateTime.toISOString(),
        advancePayment: 0,
        paymentMethod: formData.paymentOption === 'cash_on_pickup' ? 'cash' : 'online',
        specialInstructions: formData.specialInstructions,
      };

      // Step 1: Create order (status = pending)
      console.log('📝 Creating order in pending state...');
      const result = await createOrder(orderData);

      if (!result.success) {
        toast.error(result.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const createdOrder = result.order;
      console.log('✅ Order created (pending):', createdOrder.orderNumber);

      // Step 2: Handle payment based on selection
      if (formData.paymentOption === 'cash_on_pickup') {
        // Immediate confirmation for COD
        toast.success('✅ Order placed successfully! Pay when you pick up.');
        setOrderPlaced(true);
        setPlacedOrder(createdOrder);
        await fetchOrders();
        clearCart();
        setLoading(false);
      } 
      else if (formData.paymentOption === 'online_full') {
        const amount = getCartTotal();
        await paymentService.openCheckout(
          createdOrder.orderNumber, // or _id if your service expects it
          amount,
          'full',
          handlePaymentSuccess,
          handlePaymentFailure
        );
        // Note: No success toast here — only in handlePaymentSuccess
      }
      else if (formData.paymentOption === 'online_advance') {
        const amount = parseFloat(formData.customAdvanceAmount);
        await paymentService.openCheckout(
          createdOrder.orderNumber,
          amount,
          'advance',
          handlePaymentSuccess,
          handlePaymentFailure
        );
        // Success handled only after verification
      }

    } catch (error) {
      console.error('❌ Unexpected error during order creation:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Success Screen
  if (orderPlaced && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <OrderSummary order={placedOrder} />
        </div>
      </div>
    );
  }

  // Empty Cart Redirect Screen
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = getCartTotal();
  const minimumAdvance = Math.ceil(totalAmount * 0.3);
  const maximumAdvance = totalAmount - 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup Location */}
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Pickup Location</h2>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Sachin Foods</p>
                  <p className="text-gray-700">Kundara, Kollam</p>
                  <p className="text-gray-700">Kerala - 691501</p>
                  <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                    <Clock size={16} />
                    Operating Hours: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Pickup Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date *</label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time *</label>
                    <select
                      name="orderTime"
                      value={formData.orderTime}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <option value="">Select time</option>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                        <option key={t} value={t}>
                          {parseInt(t) < 12 ? `${t} AM` : parseInt(t) === 12 ? '12:00 PM' : `${parseInt(t)-12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={loading}
                  placeholder="Special Instructions (Optional)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                />
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Payment Options</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Pickup */}
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentOption === 'cash_on_pickup' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="paymentOption" value="cash_on_pickup" checked={formData.paymentOption === 'cash_on_pickup'} onChange={handleInputChange} disabled={loading} className="mt-1 w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="text-green-600" size={20} />
                        <span className="font-semibold text-gray-900">Pay at Pickup</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay full amount when you collect</p>
                      <p className="text-lg font-bold text-green-600 mt-2">₹{totalAmount}</p>
                    </div>
                  </label>

                  {/* Online Full */}
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentOption === 'online_full' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="paymentOption" value="online_full" checked={formData.paymentOption === 'online_full'} onChange={handleInputChange} disabled={loading} className="mt-1 w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="text-blue-600" size={20} />
                        <span className="font-semibold text-gray-900">Pay Online (Full)</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay complete amount now via UPI/Cards/Net Banking</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">₹{totalAmount}</p>
                    </div>
                  </label>

                  {/* Online Advance */}
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentOption === 'online_advance' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="paymentOption" value="online_advance" checked={formData.paymentOption === 'online_advance'} onChange={handleInputChange} disabled={loading} className="mt-1 w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="text-purple-600" size={20} />
                        <span className="font-semibold text-gray-900">Pay Online (Advance)</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay partial now, balance on pickup</p>
                    </div>
                  </label>
                </div>

                {/* Advance Amount Selector */}
                {formData.paymentOption === 'online_advance' && (
                  <div className="mt-6 p-5 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Advance Amount</label>
                    <div className="relative mb-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg font-bold">₹</span>
                      <input
                        type="number"
                        name="customAdvanceAmount"
                        value={formData.customAdvanceAmount}
                        onChange={handleInputChange}
                        min={minimumAdvance}
                        max={maximumAdvance}
                        step="1"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border-2 border-purple-400 rounded-lg focus:border-purple-600 text-lg font-semibold"
                      />
                    </div>
                    <div className="text-xs text-gray-600 flex justify-between mb-3">
                      <span>Min: ₹{minimumAdvance} (30%)</span>
                      <span>Max: ₹{maximumAdvance}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[30, 50, 75].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, customAdvanceAmount: Math.ceil(totalAmount * pct / 100) }))}
                          disabled={loading}
                          className="py-2 bg-white border border-purple-400 rounded hover:bg-purple-100 disabled:opacity-50 font-medium"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-purple-300">
                      <div className="flex justify-between font-semibold">
                        <span>Paying Now</span>
                        <span className="text-purple-700">₹{formData.customAdvanceAmount}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-1">
                        <span>Balance on Pickup</span>
                        <span className="text-orange-600">₹{totalAmount - formData.customAdvanceAmount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                    {formData.paymentOption === 'cash_on_pickup' ? 'Placing Order...' : 'Opening Payment...'}
                  </>
                ) : (
                  formData.paymentOption === 'cash_on_pickup' ? 'Place Order' : 'Proceed to Payment'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-red-600">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;