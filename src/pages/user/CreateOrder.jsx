// pages/user/CreateOrder.jsx - FINAL FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import OrderSummary from '../../components/order/OrderSummary';
import { Calendar, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, createOrder, fetchOrders } = useOrder(); // ← Added fetchOrders
  const { user } = useAuth();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: 'Kerala',
      pincode: '',
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

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.deliveryAddress.street || !formData.deliveryAddress.city || !formData.deliveryAddress.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (!formData.orderDate || !formData.orderTime) {
      toast.error('Please select delivery date and time');
      return;
    }

    const orderDateTime = new Date(`${formData.orderDate}T${formData.orderTime}`);

    if (orderDateTime < new Date()) {
      toast.error('Delivery time must be in the future');
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

        // Success toast with unique ID (prevents duplicates in dev)
        toast.success('🎉 Order placed successfully!', {
          id: 'order-placed-success',
        });

        // CRITICAL: Refresh orders list so new order appears immediately
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
              {/* Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <input type="text" name="deliveryAddress.street" value={formData.deliveryAddress.street} onChange={handleInputChange} required placeholder="Street Address *" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="deliveryAddress.city" value={formData.deliveryAddress.city} onChange={handleInputChange} required placeholder="City *" className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500" />
                    <select name="deliveryAddress.state" value={formData.deliveryAddress.state} onChange={handleInputChange} required className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500">
                      <option value="Kerala">Kerala</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <input type="text" name="deliveryAddress.pincode" value={formData.deliveryAddress.pincode} onChange={handleInputChange} required pattern="[0-9]{6}" maxLength="6" placeholder="Pincode *" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Delivery Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500" />
                  <select name="orderTime" value={formData.orderTime} onChange={handleInputChange} required className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500">
                    <option value="">Select time</option>
                    {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                      <option key={t} value={t}>{t.replace(':00', '')} {parseInt(t) < 12 ? 'AM' : 'PM'}</option>
                    ))}
                  </select>
                </div>
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInputChange} rows="3" placeholder="Special Instructions (Optional)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500" />
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-red-600" size={24} />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                <input type="number" name="advancePayment" value={formData.advancePayment} onChange={handleInputChange} min="0" max={getCartTotal()} placeholder="Advance Payment (₹)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 mb-2" />
                <p className="text-sm text-gray-500 mb-4">Balance: ₹{getCartTotal() - formData.advancePayment}</p>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500">
                  <option value="cash">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                  <option value="upi">UPI</option>
                </select>
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