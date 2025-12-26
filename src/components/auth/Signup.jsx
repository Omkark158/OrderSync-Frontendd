// ============================================
// src/components/auth/Signup.jsx - USING API SERVICE
// ============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, ArrowRight } from 'lucide-react';
import OTPVerification from './OTPVerification';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Invalid phone number');
      return;
    }

    setLoading(true);
    try {
      // ✅ Using api service
      const response = await api.post('/auth/signup', formData);

      if (response.data.success) {
        setShowOTP(true);
        toast.success('OTP sent! Check your phone 📱');
      } else {
        setError(response.data.message || 'Signup failed');
        toast.error(response.data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMsg = err.response?.data?.message || 'Network error. Try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      // ✅ Using api service
      const response = await api.post('/auth/verify-signup', {
        phone: formData.phone,
        otp,
      });

      if (response.data.success) {
        console.log('✅ Signup successful:', response.data.user);
        
        // Store user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast.success('Account created! Welcome! 🎉', { duration: 2000 });
        
        // ✅ Force page reload to refresh AuthContext
        setTimeout(() => {
          window.location.href = '/menu';
        }, 500);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      // ✅ Using api service
      const response = await api.post('/auth/resend-signup', {
        phone: formData.phone,
      });

      if (response.data.success) {
        toast.success('OTP resent!');
      } else {
        toast.error(response.data.message || 'Failed to resend');
      }
    } catch (err) {
      console.error('Resend error:', err);
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Sachin Foods</h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                  maxLength="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">We'll send you an OTP to verify</p>
            </div>

            <button
              type="submit"
              disabled={loading || formData.phone.length !== 10 || !formData.name.trim()}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Login
          </Link>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {showOTP && (
        <OTPVerification
          phone={formData.phone}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
};

export default Signup;