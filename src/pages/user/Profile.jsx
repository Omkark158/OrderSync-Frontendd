// ============================================
// 7. Profile.jsx - User Profile Page
// ============================================
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="card">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Calendar size={16} />
                <span>Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-lg">
                  <User className="text-slate-400" size={20} />
                  <span className="text-slate-900">{user.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-lg">
                <Mail className="text-slate-400" size={20} />
                <span className="text-slate-900">{user.email}</span>
                <span className="ml-auto badge badge-success">Verified</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  maxLength="10"
                />
              ) : (
                <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-lg">
                  <Phone className="text-slate-400" size={20} />
                  <span className="text-slate-900">{user.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {user.stats?.totalOrders || 0}
            </div>
            <div className="text-slate-600">Total Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ₹{user.stats?.totalSpent?.toFixed(2) || '0.00'}
            </div>
            <div className="text-slate-600">Total Spent</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {user.stats?.savedAddresses || 0}
            </div>
            <div className="text-slate-600">Saved Addresses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;