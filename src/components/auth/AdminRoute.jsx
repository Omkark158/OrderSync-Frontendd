// ============================================
// src/components/auth/AdminRoute.jsx - FULLY FIXED
// ============================================
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateAdminSession();
  }, []);

  const validateAdminSession = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    // No token or user data
    if (!adminToken || !adminUser) {
      console.log('❌ No admin session found');
      setIsValidating(false);
      setIsValid(false);
      toast.error('Admin session expired. Please login again.', {
        duration: 4000,
        icon: '🔒',
      });
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      
      // Check if user is admin
      if (user.role !== 'admin') {
        console.log('❌ User is not admin');
        setIsValidating(false);
        setIsValid(false);
        toast.error('Access denied. Admin privileges required.', {
          duration: 4000,
        });
        return;
      }

      // ✅ Validate token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (data.success && data.user.role === 'admin') {
        console.log('✅ Admin session validated');
        setIsValid(true);
      } else {
        console.log('❌ Invalid admin session');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsValid(false);
        toast.error('Admin session expired. Please login again.', {
          duration: 4000,
          icon: '🔒',
        });
      }
    } catch (error) {
      console.error('❌ Session validation error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsValid(false);
      toast.error('Session validation failed. Please login again.', {
        duration: 4000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Validating session...</p>
        </div>
      </div>
    );
  }

  // Invalid session - redirect to admin login
  if (!isValid) {
    return <Navigate to="/admin/secure-access" replace />;
  }

  // Valid admin session
  return children;
};

export default AdminRoute;