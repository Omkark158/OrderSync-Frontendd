// ============================================
// AuthContext.jsx - Fixed with Admin Support
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading auth state...');
    
    // ✅ Check for admin first, then regular user
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser) {
      try {
        const parsedAdmin = JSON.parse(adminUser);
        console.log('✅ Admin user loaded:', parsedAdmin);
        setToken(adminToken);
        setUser(parsedAdmin);
        setLoading(false);
        return;
      } catch (error) {
        console.error('❌ Error parsing admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    
    // Check for regular user
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Regular user loaded:', parsedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function (regular users)
  const login = async (phone) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Verify OTP and complete login
  const verifyLoginOTP = async (phone, otp) => {
    try {
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'Verification failed' };
    }
  };

  // Signup function
  const signup = async (name, phone) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Verify signup OTP
  const verifySignupOTP = async (phone, otp) => {
    try {
      const response = await fetch('/api/auth/verify-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'Verification failed' };
    }
  };

  // Resend OTP
  const resendOTP = async (phone, type = 'login') => {
    try {
      const endpoint = type === 'login' ? '/api/auth/resend-login' : '/api/auth/resend-signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: 'OTP resent successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to resend OTP' };
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { success: false, message: 'Failed to resend OTP' };
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 Logging out...');
    setUser(null);
    setToken(null);
    
    // Clear all tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('cart');
    
    // Navigate based on current user type
    if (user?.role === 'admin') {
      navigate('/admin/secure-access');
    } else {
      navigate('/login');
    }
  };

  // Get current user profile
  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Failed to fetch user data' };
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        return { success: true, user: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    verifyLoginOTP,
    signup,
    verifySignupOTP,
    resendOTP,
    logout,
    getCurrentUser,
    updateProfile,
    isAuthenticated,
    isAdmin,
  };

  // ✅ Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;