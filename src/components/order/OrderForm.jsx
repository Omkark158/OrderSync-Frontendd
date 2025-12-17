// ============================================
// 5. OrderForm.jsx - Order Creation Form
// ============================================
import { useState } from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import DatePicker from './DatePicker';

const OrderForm = ({ onSubmit, cartTotal }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: 'Kerala',
      pincode: '',
    },
    orderDateTime: '',
    specialInstructions: '',
    paymentMethod: 'online',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        deliveryAddress: {
          ...formData.deliveryAddress,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!/^[6-9]\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid phone number';
    }

    if (!formData.deliveryAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!/^\d{6}$/.test(formData.deliveryAddress.pincode)) {
      newErrors.pincode = 'Invalid pincode';
    }

    if (!formData.orderDateTime) {
      newErrors.orderDateTime = 'Delivery date & time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                errors.customerName ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
              }`}
              placeholder="Enter your name"
            />
            {errors.customerName && (
              <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              maxLength="10"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
              }`}
              placeholder="10-digit phone number"
            />
            {errors.customerPhone && (
              <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-red-600" />
          Delivery Address
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="deliveryAddress.street"
              value={formData.deliveryAddress.street}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                errors.street ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
              }`}
              placeholder="House/Flat No., Street Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress.city"
                value={formData.deliveryAddress.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.city ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                }`}
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress.state"
                value={formData.deliveryAddress.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress.pincode"
                value={formData.deliveryAddress.pincode}
                onChange={handleChange}
                maxLength="6"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  errors.pincode ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
                }`}
                placeholder="6-digit pincode"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Date & Time */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <DatePicker
          value={formData.orderDateTime}
          onChange={(value) => setFormData({ ...formData, orderDateTime: value })}
        />
      </div>

      {/* Special Instructions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-red-600" />
          Special Instructions (Optional)
        </h2>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          rows="4"
          maxLength="500"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
          placeholder="Any special requests or instructions for your order..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.specialInstructions.length}/500 characters
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={formData.paymentMethod === 'online'}
              onChange={handleChange}
              className="w-4 h-4 text-red-600"
            />
            <div>
              <p className="font-medium">Online Payment</p>
              <p className="text-sm text-gray-600">Pay securely via Razorpay</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleChange}
              className="w-4 h-4 text-red-600"
            />
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-gray-600">Pay when you receive your order</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating Order...' : `Place Order - ₹${cartTotal.toFixed(2)}`}
      </button>
    </form>
  );
};

export default OrderForm;