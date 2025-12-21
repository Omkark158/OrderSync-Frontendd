// pages/user/CreateOrder.jsx - PICKUP ONLY (No Delivery)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import OrderSummary from '../../components/order/OrderSummary';
import { Calendar, MapPin, CreditCard, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, createOrder, fetchOrders } = useOrder();
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
    advancePayment: 0,
    paymentMethod: 'cash',
    specialInstructions: '',
  });

  // Redirect if cart is empty (but not after successful order)
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty');
      navigate('/menu');
    }
  }, [cart, navigate, orderPlaced]);

  // Set today's date as minimum
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, orderDate: today }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orderDate || !formData.orderTime) {
      toast.error('Please select pickup date and time');
      return;
    }

    const orderDateTime = new Date(`${formData.orderDate}T${formData.orderTime}`);

    if (orderDateTime < new Date()) {
      toast.error('Pickup time must be in the future');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        orderDateTime: orderDateTime.toISOString(),
      };
      delete orderData.orderDate;
      delete orderData.orderTime;

      const result = await createOrder(orderData);

      if (result.success) {
        setOrderPlaced(true);
        setPlacedOrder(result.order);

        // Refresh orders list
        await fetchOrders();
      } else {
        toast.error(result.message || 'Failed to create order');
        setLoading(false);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  // Show success summary
  if (orderPlaced && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <OrderSummary order={placedOrder} />
        </div>
      </div>
    );
  }

  // Show empty cart screen
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup Location Info */}
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
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    📍 <strong>Self Pickup Only:</strong> Please collect your order from our store at the scheduled time.
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
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time *</label>
                    <select
                      name="orderTime"
                      value={formData.orderTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select time</option>
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                        <option key={t} value={t}>{t.replace(':00', ':00')} {parseInt(t) < 12 ? 'AM' : 'PM'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Special Instructions (Optional)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advance Payment (Optional)
                  </label>
                  <input
                    type="number"
                    name="advancePayment"
                    value={formData.advancePayment}
                    onChange={handleInputChange}
                    min="0"
                    max={getCartTotal()}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                  />
                  <p className="text-sm text-gray-500">
                    Total: ₹{getCartTotal()} | Balance: ₹{getCartTotal() - formData.advancePayment}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="cash">Pay at Pickup (Cash)</option>
                    <option value="online">Online Payment</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-red-600">
                  <span>Total</span>
                  <span>₹{getCartTotal()}</span>
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