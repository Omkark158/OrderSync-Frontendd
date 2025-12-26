// ============================================
// context/AuthContext.jsx - FINAL ULTIMATE VERSION
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

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
  const location = useLocation();

  // ============================================
  // INITIALIZATION - Load user from localStorage
  // ============================================
  useEffect(() => {
    console.log('🔄 AuthContext: Initializing...');
    loadAuthState();
  }, []);

  // Load auth state from localStorage
  const loadAuthState = () => {
    try {
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        // Load admin credentials
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');
        
        if (adminToken && adminUser) {
          const parsedAdmin = JSON.parse(adminUser);
          console.log('✅ Admin loaded:', parsedAdmin.email);
          setToken(adminToken);
          setUser(parsedAdmin);
        }
      } else {
        // Load regular user credentials
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ User loaded:', parsedUser.name);
          setToken(storedToken);
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('❌ Error loading auth state:', error);
      clearAllAuth();
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  // Clear all authentication data
  const clearAllAuth = () => {
    console.log('🧹 Clearing all auth data');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('cart');
  };

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  // Get current user from API
  const getCurrentUser = async () => {
    if (!token) {
      console.log('⚠️ No token available for getCurrentUser');
      return { success: false, message: 'No token available' };
    }

    try {
      console.log('📡 Fetching current user from API...');
      const response = await api.get('/auth/me');

      if (response.data.success) {
        const apiUser = response.data.user;
        console.log('✅ User fetched:', apiUser.name || apiUser.email);
        
        setUser(apiUser);
        
        // Update correct storage based on role
        if (apiUser.role === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify(apiUser));
        } else {
          localStorage.setItem('user', JSON.stringify(apiUser));
        }
        
        // Notify other components (navbar, profile, etc.)
        window.dispatchEvent(new Event('userUpdated'));
        
        return { success: true, user: apiUser };
      } else {
        console.log('⚠️ API returned unsuccessful response');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Get user error:', error);
      
      if (error.response?.status === 401) {
        console.log('🔐 Session expired (401)');
        clearAllAuth();
        navigate('/login', { replace: true });
        toast.error('Session expired. Please login again.');
      }
      
      return { success: false, message: 'Failed to fetch user data' };
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    if (!token) {
      return { success: false, message: 'No token available' };
    }

    try {
      console.log('📡 Updating profile...');
      const response = await api.put('/users/profile', updateData);

      if (response.data.success) {
        const updatedUser = response.data.data;
        console.log('✅ Profile updated:', updatedUser.name);
        
        setUser(updatedUser);
        
        // Update correct storage based on role
        if (updatedUser.role === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        } else {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // Notify navbar to update name
        window.dispatchEvent(new Event('userUpdated'));
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  // ============================================
  // AUTHENTICATION CHECKS
  // ============================================
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    // Check both state and localStorage for reliability
    const hasToken = !!token || 
                     !!localStorage.getItem('token') || 
                     !!localStorage.getItem('adminToken');
    
    const hasUser = !!user || 
                    !!localStorage.getItem('user') || 
                    !!localStorage.getItem('adminUser');
    
    const authenticated = hasToken && hasUser;
    
    if (!authenticated) {
      console.log('⚠️ User not authenticated');
    }
    
    return authenticated;
  };

  // Check if user is admin
  const isAdmin = () => {
    const adminStatus = user?.role === 'admin';
    return adminStatus;
  };

  // ============================================
  // LOGOUT
  // ============================================
  
  const logout = async () => {
    console.log('🚪 Logging out:', user?.role || 'unknown user');
    
    const wasAdmin = user?.role === 'admin';
    
    try {
      // Call backend logout to clear cookies
      await api.post('/auth/logout');
      console.log('✅ Backend logout successful');
    } catch (error) {
      console.error('⚠️ Logout API error (continuing anyway):', error);
    }
    
    // Clear all local data
    clearAllAuth();
    
    // Navigate based on previous role
    if (wasAdmin) {
      navigate('/admin/secure-access', { replace: true });
      toast.success('Admin logged out successfully');
    } else {
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    }
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value = {
    // State
    user,
    token,
    loading,
    
    // Functions
    getCurrentUser,
    updateProfile,
    logout,
    isAuthenticated,
    isAdmin,
  };

  // ============================================
  // RENDER
  // ============================================
  
  // Show loading screen while checking auth
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;