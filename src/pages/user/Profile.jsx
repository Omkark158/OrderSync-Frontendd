// pages/user/Profile.jsx - COMPLETE WITH 4 STATS CARDS
import { useState, useEffect } from 'react';
import { User, Phone, Edit2, Save, X, ShoppingBag, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user, getCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalExpense: 0,
    averageOrderValue: 0,
    lastOrderDate: null,
    loading: true,
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setPageLoading(true);
        
        if (!user) {
          await getCurrentUser();
        } else {
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load profile');
      } finally {
        setPageLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Fetch order statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const response = await api.get('/orders/my-orders');
        if (response.data.success) {
          const orders = response.data.data;
          
          const totalOrders = orders.length;
          const totalExpense = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          const averageOrderValue = totalOrders > 0 ? Math.round(totalExpense / totalOrders) : 0;
          
          // Find last order date
          const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          const lastOrderDate = sortedOrders.length > 0 ? sortedOrders[0].createdAt : null;
          
          setStats({
            totalOrders,
            totalExpense,
            averageOrderValue,
            lastOrderDate,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch order stats:', error);
        setStats({
          totalOrders: 0,
          totalExpense: 0,
          averageOrderValue: 0,
          lastOrderDate: null,
          loading: false,
        });
      }
    };

    fetchStats();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      const result = await api.put('/users/profile', { name: formData.name });
      
      toast.dismiss(loadingToast);
      
      if (result.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        await getCurrentUser();
        window.dispatchEvent(new Event('userUpdated'));
      } else {
        toast.error(result.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No orders yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No user data found</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{user.phone}</p>
              <p className="text-xs text-gray-500 mt-1">
                {user.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-400" size={20} />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              )}
            </div>

            {/* Phone (Read-Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
                <Phone className="text-gray-400" size={20} />
                <span className="text-gray-600">{user.phone}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                🔒 Phone number cannot be changed
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards - 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="text-red-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            {stats.loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            )}
          </div>

          {/* Total Expense */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Expense</p>
            {stats.loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalExpense.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg. Order Value</p>
            {stats.loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.averageOrderValue.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Last Order Date */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Last Order</p>
            {stats.loading ? (
              <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {formatDate(stats.lastOrderDate)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;