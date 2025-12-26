// ============================================
// pages/admin/AdminProfile.jsx - BULLETPROOF VERSION
// ============================================
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Shield, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    console.log('🔍 AdminProfile mounted');
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      console.log('📡 Fetching admin profile...');
      
      // First check localStorage
      const adminUser = localStorage.getItem('adminUser');
      const adminToken = localStorage.getItem('adminToken');
      
      console.log('LocalStorage check:', {
        hasUser: !!adminUser,
        hasToken: !!adminToken
      });

      if (!adminToken) {
        console.error('❌ No admin token found');
        toast.error('Session expired. Please login again.');
        navigate('/admin/secure-access');
        return;
      }

      if (adminUser) {
        const parsedUser = JSON.parse(adminUser);
        console.log('✅ User from localStorage:', parsedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
        });
      }

      // Then fetch fresh data from API
      const response = await api.get('/auth/me');
      console.log('📡 API response:', response.data);
      
      if (response.data.success) {
        const apiUser = response.data.user;
        console.log('✅ User from API:', apiUser);
        
        setUser(apiUser);
        setFormData({
          name: apiUser.name || '',
          email: apiUser.email || '',
          phone: apiUser.phone || '',
        });
        
        // Update localStorage
        localStorage.setItem('adminUser', JSON.stringify(apiUser));
      }
    } catch (error) {
      console.error('❌ Load profile error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/secure-access');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaveLoading(true);
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      const response = await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
      });
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Refresh profile
        await loadAdminProfile();
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/secure-access');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load admin profile</p>
            <button
              onClick={loadAdminProfile}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-red-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          </div>
          <p className="text-gray-600">Manage your administrator account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center relative">
                  <User className="text-red-600" size={48} />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <Shield className="text-white" size={16} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <User className="text-gray-400" size={20} />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                    <Mail className="text-gray-400" size={20} />
                    <span className="text-gray-900">{user.email}</span>
                    <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Verified</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      maxLength="10"
                      placeholder="Enter 10-digit phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                      <Phone className="text-gray-400" size={20} />
                      <span className="text-gray-900">{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                    <Shield className="text-gray-400" size={20} />
                    <span className="text-gray-900 font-medium">Administrator</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {saveLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saveLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-red-600" size={20} />
                <h3 className="font-semibold text-gray-900">Account Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Account Type</p>
                  <p className="font-medium text-gray-900">Administrator</p>
                </div>
                <div>
                  <p className="text-gray-500">Access Level</p>
                  <p className="font-medium text-gray-900">Full Access</p>
                </div>
              </div>
            </div>

            {/* Admin Permissions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="text-red-600" size={20} />
                <h3 className="font-semibold text-gray-900">Permissions</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Manage Orders</span>
                  <span className="text-green-600 font-medium">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Manage Menu</span>
                  <span className="text-green-600 font-medium">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">View Analytics</span>
                  <span className="text-green-600 font-medium">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Manage Users</span>
                  <span className="text-green-600 font-medium">✓ Enabled</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">System Health</span>
                  <span className="text-green-600 font-medium">● Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900 font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;