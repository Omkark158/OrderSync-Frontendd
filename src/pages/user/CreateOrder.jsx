// ============================================
// 4. CreateOrder.jsx - Order Creation Flow
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import OrderForm from '../../components/order/OrderForm';
import OrderSummary from '../../components/order/OrderSummary';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { cart, getFinalTotal, createOrder } = useOrder();
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
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

  const handleSubmitOrder = async (formData) => {
    setLoading(true);
    try {
      const result = await createOrder(formData);
      
      if (result.success) {
        // Redirect to payment page
        navigate(`/payment?orderId=${result.order._id}`);
      } else {
        alert(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Order</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <OrderForm onSubmit={handleSubmitOrder} cartTotal={getFinalTotal()} />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-red-600">
                    <span>Total</span>
                    <span>₹{getFinalTotal().toFixed(2)}</span>
                  </div>
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